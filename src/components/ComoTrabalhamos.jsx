import { useEffect, useRef } from 'react'

const STEPS = [
  { num: 1, title: 'Análise', desc: 'Primeiro entendemos onde seu negócio está hoje e o que precisa melhorar para gerar mais resultado.' },
  { num: 2, title: 'Direção', desc: 'Definimos a solução mais adequada, com escopo claro, prazo realista e investimento objetivo.' },
  { num: 3, title: 'Construção', desc: 'Desenvolvemos com foco em clareza, confiança e facilidade para quem vai acessar.' },
  { num: 4, title: 'Entrega', desc: 'Colocamos no ar, ajustamos o necessário e deixamos tudo pronto para você começar a usar.' },
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
      <h2 className="section-title reveal">Como funciona</h2>
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
