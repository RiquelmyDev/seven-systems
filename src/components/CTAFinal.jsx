import { useEffect, useRef } from 'react'

const WA = 'https://wa.me/5533998542884?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20saber%20mais%20sobre%20a%20Seven%20Systems.'

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
      <h2 className="reveal">Pronto para ser encontrado?</h2>
      <p className="reveal">Fale com a gente hoje. Sem compromisso, sem enrolação.</p>
      <a href={WA} target="_blank" rel="noreferrer" className="btn-primary reveal">
        Chamar no WhatsApp
      </a>
    </section>
  )
}
