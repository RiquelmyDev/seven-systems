import { useEffect, useRef, useState } from 'react'
import { makeWhatsAppLink, WHATSAPP_MESSAGES } from '../utils/whatsapp'

const SERVICOS = [
  {
    badge: 'Entrada',
    name: 'Landing Page',
    ctaLabel: 'Quero a Landing Page',
    desc: 'Página direta para destacar seu principal serviço e facilitar o contato de quem já chegou pronto para decidir.',
    ideal: 'Negócios que precisam ganhar agilidade na captação e no agendamento.',
    details: [
      'Boa para clínicas, consultórios e negócios locais que querem uma porta de entrada mais profissional.',
      'Pode reunir prova social, localização, serviço principal e botão de contato em uma estrutura simples.',
      'É a solução mais rápida para sair do improviso e começar a atender melhor quem chega pelo digital.',
    ],
    msg: WHATSAPP_MESSAGES.landingPage,
  },
  {
    badge: 'Institucional',
    name: 'Site Institucional',
    ctaLabel: 'Quero o Site Institucional',
    desc: 'Site completo para apresentar sua empresa com mais clareza, autoridade e organização.',
    ideal: 'Negócios que precisam transmitir confiança antes mesmo do primeiro contato.',
    details: [
      'Indicado para quem tem mais de um serviço, precisa explicar melhor o que faz e quer parecer mais profissional.',
      'Pode incluir apresentação da empresa, serviços, diferenciais, depoimentos, localização e contato.',
      'Ajuda o cliente a entender o valor do negócio antes de chamar no WhatsApp.',
    ],
    msg: WHATSAPP_MESSAGES.siteInstitucional,
  },
  {
    badge: 'Completo',
    name: 'Presença Completa',
    ctaLabel: 'Quero a Presença Completa',
    desc: 'Estrutura completa para organizar o site, os canais de contato e a imagem digital do negócio.',
    ideal: 'Negócios que já entenderam que presença digital precisa virar resultado.',
    details: [
      'Faz sentido para quem quer melhorar não só o visual, mas também a forma como o cliente encontra e entra em contato.',
      'Pode envolver site, Google, fluxo de atendimento e ajustes nos principais pontos de conversão.',
      'É a melhor opção para negócios que querem parar de parecer improvisados no digital.',
    ],
    msg: WHATSAPP_MESSAGES.presencaCompleta,
  },
]

export default function Servicos() {
  const ref = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      setVisibleCards(current => {
        const next = new Set(current)
        entries.forEach(e => {
          const index = e.target.dataset.index
          if (e.isIntersecting && index !== undefined) next.add(Number(index))
        })
        return [...next]
      })
    }, { threshold: 0.12 })

    const root = ref.current
    if (!root) return undefined

    root.querySelectorAll('.reveal').forEach(el => io.observe(el))
    root.querySelectorAll('.serv-card').forEach(el => io.observe(el))

    return () => io.disconnect()
  }, [])

  return (
    <section id="servicos" ref={ref}>
      <h2 className="section-title reveal">Soluções</h2>
      <div className="servicos-grid">
        {SERVICOS.map((s, i) => (
          <div
            key={s.name}
            data-index={i}
            className={`serv-card${visibleCards.includes(i) ? ' visible' : ''}${openIndex === i ? ' open' : ''}`}
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
                Entender melhor
              </button>
              <a
                href={makeWhatsAppLink(s.msg)}
                target="_blank"
                rel="noreferrer"
                className="serv-btn serv-btn-primary"
              >
                {s.ctaLabel}
              </a>
            </div>
            <div
              id={`serv-details-${i}`}
              className={`serv-details${openIndex === i ? ' open' : ''}`}
            >
              <div className="serv-details-title">O que essa solução resolve</div>
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
