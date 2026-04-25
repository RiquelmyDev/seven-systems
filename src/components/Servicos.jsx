import { useEffect, useRef } from 'react'
import { makeWhatsAppLink } from '../utils/whatsapp'

const SERVICOS = [
  {
    badge: 'Básico', name: 'Landing Page', featured: false,
    desc: 'Página objetiva com seus serviços, fotos, localização e botão direto para o WhatsApp.',
    ideal: 'Negócios que precisam de presença imediata',
    msg: 'Olá! Tenho interesse na Landing Page da Seven Systems.',
  },
  {
    badge: 'Profissional', name: 'Site Institucional', featured: true,
    desc: 'Site completo com múltiplas seções, formulário de contato e integração com Google Maps.',
    ideal: 'Negócios que querem transmitir credibilidade',
    msg: 'Olá! Tenho interesse no Site Institucional da Seven Systems.',
  },
  {
    badge: 'Presença Digital', name: 'Presença Completa', featured: false,
    desc: 'Site institucional + organização completa da presença digital: Google, redes sociais e mais.',
    ideal: 'Negócios prontos para crescer no digital',
    msg: 'Olá! Tenho interesse no pacote Presença Completa da Seven Systems.',
  },
]

export default function Servicos() {
  const ref = useRef(null)

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
            className={`serv-card${s.featured ? ' featured' : ''}`}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div className="serv-badge">{s.badge}</div>
            <div className="serv-name">{s.name}</div>
            <div className="serv-desc">{s.desc}</div>
            <div className="serv-ideal">Ideal para: {s.ideal}</div>
            <a href={makeWhatsAppLink(s.msg)} target="_blank" rel="noreferrer" className="serv-cta">
              Quero esse
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
