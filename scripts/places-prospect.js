import { mkdir, writeFile } from 'node:fs/promises'
import fs from 'node:fs'
import { join } from 'node:path'

function loadDotEnvFile(filepath) {
  if (!fs.existsSync(filepath)) return

  const text = fs.readFileSync(filepath, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const eq = line.indexOf('=')
    if (eq === -1) continue

    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

// Allows local secrets without exporting vars in the shell.
// `.env.local` is already gitignored by `*.local` in this repo.
loadDotEnvFile(join(process.cwd(), '.env.local'))
loadDotEnvFile(join(process.cwd(), '.env'))

const API_KEY = process.env.GOOGLE_MAPS_API_KEY
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'
const OUTPUT_DIR = process.env.GOOGLE_MAPS_OUTPUT_DIR || join(process.cwd(), 'prospeccao')
const MAX_RESULTS = Number.parseInt(process.env.GOOGLE_MAPS_MAX_RESULTS || '20', 10)

if (!API_KEY) {
  console.error('Defina GOOGLE_MAPS_API_KEY antes de executar o script.')
  process.exit(1)
}

const CITIES = ['Coronel Fabriciano', 'Ipatinga', 'Timóteo']
const SEGMENTS = ['Clínica Odontológica', 'Clínica Estética', 'Salão de Beleza', 'Consultório Médico']
const CITY_ORDER = new Map(CITIES.map((name, index) => [name, index]))

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.businessStatus',
].join(',')

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function displayNameText(place) {
  if (typeof place.displayName === 'string') return place.displayName
  return place.displayName?.text || ''
}

function getWebsite(place) {
  return place.websiteUri || ''
}

function getInstagram(place) {
  const website = getWebsite(place)
  return website.includes('instagram.com') ? website : ''
}

function getSite(place) {
  const website = getWebsite(place)
  return website && !website.includes('instagram.com') ? website : ''
}

function makeSearchQuery(segment, city) {
  return `${segment.toLowerCase()} em ${city}, MG`
}

async function searchText({ city, segment }) {
  const body = {
    textQuery: makeSearchQuery(segment, city),
    languageCode: 'pt-BR',
    regionCode: 'BR',
    rankPreference: 'RELEVANCE',
    maxResultCount: MAX_RESULTS,
  }

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Places API erro ${response.status}: ${text}`)
  }

  return response.json()
}

function dedupeKey(place) {
  const id = place.id || ''
  if (id) return id

  const name = normalizeText(displayNameText(place))
  const address = normalizeText(place.formattedAddress || '')
  return `${name}::${address}`
}

function toRecord(place, city, segment) {
  const rating = typeof place.rating === 'number' ? place.rating : null
  const reviews = Number.isFinite(place.userRatingCount) ? place.userRatingCount : 0
  const status = place.businessStatus || ''
  const isOperational = status === 'OPERATIONAL' || status === 'BUSINESS_STATUS_OPERATIONAL'

  if (!isOperational || rating === null || rating < 4.0 || reviews < 20) {
    return null
  }

  return {
    cidade: city,
    segmento: segment,
    nome_negocio: displayNameText(place) || 'não encontrado',
    nota: rating.toFixed(1),
    num_avaliacoes: String(reviews),
    telefone: place.nationalPhoneNumber || '',
    instagram: getInstagram(place),
    site: getSite(place),
  }
}

async function main() {
  const records = []
  const seen = new Set()

  for (const city of CITIES) {
    for (const segment of SEGMENTS) {
      const queryLabel = makeSearchQuery(segment, city)
      process.stdout.write(`Pesquisando: ${queryLabel}\n`)

      const payload = await searchText({ city, segment })
      const places = Array.isArray(payload.places) ? payload.places : []

      for (const place of places) {
        const key = dedupeKey(place)
        if (seen.has(key)) continue
        const record = toRecord(place, city, segment)
        seen.add(key)
        if (record) records.push(record)
      }
    }
  }

  records.sort((a, b) => {
    const cityDiff = (CITY_ORDER.get(a.cidade) ?? 99) - (CITY_ORDER.get(b.cidade) ?? 99)
    if (cityDiff !== 0) return cityDiff

    const ratingDiff = Number.parseFloat(b.nota) - Number.parseFloat(a.nota)
    if (ratingDiff !== 0) return ratingDiff

    const reviewsDiff = Number.parseInt(b.num_avaliacoes, 10) - Number.parseInt(a.num_avaliacoes, 10)
    if (reviewsDiff !== 0) return reviewsDiff

    return a.nome_negocio.localeCompare(b.nome_negocio, 'pt-BR')
  })

  await mkdir(OUTPUT_DIR, { recursive: true })

  const jsonPath = join(OUTPUT_DIR, 'leads-google-places.json')
  const csvPath = join(OUTPUT_DIR, 'leads-google-places.csv')
  const sheetCsvPath = join(OUTPUT_DIR, 'leads-google-places-sheet.csv')

  await writeFile(jsonPath, `${JSON.stringify(records, null, 2)}\n`, 'utf8')

  const headers = ['cidade', 'segmento', 'nome_negocio', 'nota', 'num_avaliacoes', 'telefone', 'instagram', 'site']
  const csv = [
    headers.join(','),
    ...records.map((record) => headers.map((header) => csvEscape(record[header])).join(',')),
  ].join('\n')

  await writeFile(csvPath, `${csv}\n`, 'utf8')

  const sheetHeaders = [
    'Cidade',
    'Segmento',
    'Nome do Negócio',
    'Nota',
    'Nº de Avaliações',
    'Telefone',
    'Instagram',
    'Site',
  ]
  const sheetRows = records.map((record) => [
    record.cidade,
    record.segmento,
    record.nome_negocio,
    record.nota,
    record.num_avaliacoes,
    record.telefone,
    record.instagram,
    record.site,
  ])
  const sheetCsv = [
    sheetHeaders.join(','),
    ...sheetRows.map((row) => row.map((value) => csvEscape(value)).join(',')),
  ].join('\n')
  await writeFile(sheetCsvPath, `${sheetCsv}\n`, 'utf8')

  const grouped = records.reduce((acc, record) => {
    acc[record.cidade] ??= { total: 0 }
    acc[record.cidade].total += 1
    return acc
  }, {})

  console.log('\nResumo:')
  console.log(JSON.stringify(grouped, null, 2))
  console.log(`\nArquivos gerados:`)
  console.log(`- ${jsonPath}`)
  console.log(`- ${csvPath}`)
  console.log(`- ${sheetCsvPath}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
