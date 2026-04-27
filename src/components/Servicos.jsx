import { useEffect, useRef, useState } from 'react'
import { makeWhatsAppLink } from '../utils/whatsapp'

const SERVICOS = [
  {
    badge: 'Entrada',
    name: 'Landing Page',
    desc: 'Página enxuta para apresentar sua oferta principal com foco total em conversão.',
    ideal: 'Negócios que precisam vender ou captar contatos com rapidez.',
    details: [
      'Ideal para apresentar um único serviço, campanha ou produto com clareza.',
      'Estrutura objetiva com CTA, prova social, localização e acesso rápido ao WhatsApp.',
      'Pensada para gerar contatos sem excesso de informação ou navegação complexa.',
    ],
    msg: 'Olá! Tenho interesse na Landing Page da Seven Systems.',
  },
  {
    badge: 'Institucional',
    name: 'Site Institucional',
    desc: 'Site completo para apresentar sua empresa, serviços, autoridade e canais de contato.',
    ideal: 'Negócios que querem transmitir confiança e presença profissional.',
    details: [
      'Boa escolha para empresas que precisam de várias seções e narrativa institucional.',
      'Pode incluir quem somos, serviços, diferenciais, depoimentos, contato e mapa.',
      'Ajuda a organizar a presença digital e fortalecer a imagem da marca.',
    ],
    msg: 'Olá! Tenho interesse no Site Institucional da Seven Systems.',
  },
  {
    badge: 'Completo',
    name: 'Presença Completa',
    desc: 'Pacote para estruturar o site e organizar os pontos principais da presença digital.',
    ideal: 'Negócios prontos para crescer com uma presença mais consistente.',
    details: [
      'Indicado para quem quer ir além do site e organizar o posicionamento digital.',
      'Pode incluir orientação de presença no Google, redes sociais e fluxo de contato.',
      'É o pacote mais indicado para consolidar a marca em um único ambiente digital.',
    ],
    msg: 'Olá! Tenho interesse no pacote Presença Completa da Seven Systems.',
  },
]

export default function Servicos() {
  const ref = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    ref.current.querySelectorAll('.reveal, .serv-card').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="servicos" ref={ref}>
      <h2 className="section-title reveal">Serviços</h2>
      <div className="servicos-grid">
        {SERVICOS.map((s, i) => (
          <div
            key={s.name}
            className={`serv-card${openIndex === i ? ' open' : ''}`}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div className="serv-badge">{s.badge}</div>
            <div className="serv-name">{s.name}</div>
            <div className="serv-desc">{s.desc}</div>
            <div className="serv-ideal">Ideal para: {s.ideal}</div>
            <div className="serv-actions">
              <button
                type="button"
                className="serv-btn serv-btn-secondary"
                onClick={() => setOpenIndex(current => (current === i ? null : i))}
                aria-expanded={openIndex === i}
                aria-controls={`serv-details-${i}`}
              >
                Ver detalhes
              </button>
              <a
                href={makeWhatsAppLink(s.msg)}
                target="_blank"
                rel="noreferrer"
                className="serv-btn serv-btn-primary"
              >
                Quero esse
              </a>
            </div>
            <div
              id={`serv-details-${i}`}
              className={`serv-details${openIndex === i ? ' open' : ''}`}
            >
              <div className="serv-details-title">Como funciona este serviço</div>
              <ul>
                {s.details.map(detail => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
