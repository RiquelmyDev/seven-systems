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
        <p>A Seven Systems nasceu com um propósito simples: levar tecnologia de verdade para negócios locais. Sem templates prontos. Sem soluções genéricas. Cada projeto é pensado do zero para o negócio do cliente.</p>
        <p>Somos uma empresa jovem, com visão global e execução local. Trabalhamos com as ferramentas mais modernas do mercado para entregar sites e sistemas que geram resultado real.</p>
        <p>Fundada em 2026 — Vale do Aço, MG — Technology Platform.</p>
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
