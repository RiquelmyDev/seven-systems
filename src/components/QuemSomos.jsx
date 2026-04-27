import { useEffect, useRef } from 'react'
import logo from '/logo-7s.png'

export default function QuemSomos() {
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    ref.current.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="quem-somos" ref={ref}>
      <div className="qs-text reveal">
        <h2>Quem somos</h2>
        <p>A Seven Systems nasceu para resolver um problema simples: muito negócio bom ainda se apresenta mal no digital. A gente entra para organizar isso com clareza, estética e foco em resultado.</p>
        <p>Nosso trabalho é construir páginas, sites e estruturas digitais que valorizam o negócio, facilitam o contato e passam mais confiança para quem está do outro lado da tela.</p>
        <p>Atuação no Vale do Aço, MG. Projetos pensados para negócios locais que querem crescer com presença profissional.</p>
      </div>
      <div className="qs-visual reveal">
        <div className="qs-glow" />
        <img
          src={logo}
          alt="Seven Systems"
          style={{ height: '180px', width: 'auto', filter: 'drop-shadow(0 0 40px rgba(155,48,255,0.4))', animation: 'float-logo 7s ease-in-out infinite' }}
        />
      </div>
    </section>
  )
}
