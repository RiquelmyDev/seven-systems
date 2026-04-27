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
        "Hoje, a primeira impressão do seu negócio acontece no <span className="prob-accent">Google</span> e no celular."
      </p>
      <p className="prob-line">
        "Quando essa experiência é confusa, fraca ou incompleta, você perde espaço para quem se apresenta melhor."
      </p>
    </section>
  )
}
