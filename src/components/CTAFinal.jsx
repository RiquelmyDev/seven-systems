import { useEffect, useRef } from 'react'
import { makeWhatsAppLink, WHATSAPP_MESSAGES } from '../utils/whatsapp'

export default function CTAFinal() {
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    ref.current.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
      <section id="cta-final" ref={ref}>
      <h2 className="reveal">Seu negócio já passa a imagem que deveria passar?</h2>
      <p className="reveal">Se a resposta for não, a gente pode te mostrar por onde começar.</p>
      <a
        href={makeWhatsAppLink(WHATSAPP_MESSAGES.final)}
        target="_blank"
        rel="noreferrer"
        className="btn-primary reveal"
      >
        Falar no WhatsApp
      </a>
    </section>
  )
}
