import { useEffect, useRef } from 'react'

export default function Problema() {
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    ref.current.querySelectorAll('.prob-line').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="problema" ref={ref}>
      <p className="prob-line">
        "Seu cliente te procura no Google <span className="prob-accent">antes</span> de ligar."
      </p>
      <p className="prob-line">
        "Se não encontra nada — ou encontra algo feio — ele escolhe o concorrente."
      </p>
    </section>
  )
}
