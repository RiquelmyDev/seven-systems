import { useEffect, useRef } from 'react'

const STEPS = [
  { num: 1, title: 'Diagnóstico', desc: 'Entendemos o negócio, o público e o objetivo antes de qualquer linha de código.' },
  { num: 2, title: 'Proposta',    desc: 'Apresentamos a solução certa, com escopo, prazo e investimento claros.' },
  { num: 3, title: 'Execução',    desc: 'Desenvolvemos com atenção a cada detalhe — design, performance e usabilidade.' },
  { num: 4, title: 'Entrega',     desc: 'Site no ar, cliente orientado, suporte garantido.' },
]

export default function ComoTrabalhamos() {
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    ref.current.querySelectorAll('.reveal, .step-item').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="como" ref={ref}>
      <h2 className="section-title reveal">Como trabalhamos</h2>
      <div className="steps-wrap">
        {STEPS.map((s, i) => (
          <div key={s.num} className="step-item" style={{ transitionDelay: `${i * 0.12}s` }}>
            <div className="step-num">{s.num}</div>
            {i < STEPS.length - 1 && <div className="step-line" />}
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
