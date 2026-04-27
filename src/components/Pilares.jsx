import { useEffect, useRef, useState } from 'react'

const PILARES = [
  { num: '01', name: 'Clareza', desc: 'Seu cliente precisa entender rápido o que você faz e por que deve escolher você.' },
  { num: '02', name: 'Confiança', desc: 'Cada detalhe da apresentação digital precisa passar segurança.' },
  { num: '03', name: 'Estética', desc: 'Visual bom não é enfeite. Ele valoriza o negócio e aumenta percepção de qualidade.' },
  { num: '04', name: 'Conversão', desc: 'A presença digital precisa facilitar o próximo passo, não dificultar.' },
  { num: '05', name: 'Estratégia', desc: 'Cada página e cada botão precisam ter motivo para existir.' },
  { num: '06', name: 'Facilidade', desc: 'Se for complicado para o cliente ou para a equipe, não está resolvido.' },
  { num: '07', name: 'Crescimento', desc: 'A estrutura precisa servir o momento atual e abrir espaço para a próxima fase.' },
]

function ColumnSVG() {
  return (
    <svg className="col-svg" viewBox="0 0 100 363" xmlns="http://www.w3.org/2000/svg">
      <rect className="col-gold-fill" x="4" y="2" width="92" height="11"/>
      <path className="col-gold-stroke" d="M4 2 L96 2 L96 13 L4 13 Z"/>
      <path className="col-gold-stroke" d="M4 13 Q2 20 6 28 Q10 36 18 34 Q26 32 24 24 Q22 18 16 18 Q12 18 12 22 Q12 26 16 26 Q19 26 19 23" strokeWidth="1"/>
      <path className="col-gold-stroke" d="M96 13 Q98 20 94 28 Q90 36 82 34 Q74 32 76 24 Q78 18 84 18 Q88 18 88 22 Q88 26 84 26 Q81 26 81 23" strokeWidth="1"/>
      <path className="col-gold-fill" d="M18 34 Q50 46 82 34 L80 52 Q50 58 20 52 Z"/>
      <path className="col-gold-stroke" d="M18 34 Q50 46 82 34"/>
      <path className="col-gold-stroke" d="M20 52 Q50 58 80 52"/>
      <rect className="col-gold-fill" x="24" y="52" width="52" height="5"/>
      <path className="col-gold-stroke" d="M24 52 L76 52 L76 57 L24 57 Z"/>
      <rect className="col-gold-dark" x="25" y="57" width="50" height="3"/>
      <path className="col-gold-fill" d="M 25 60 L 75 60 L 78 300 L 22 300 Z"/>
      <path className="col-gold-stroke" d="M 25 60 L 75 60 L 78 300 L 22 300 Z"/>
      <line className="col-gold-line" x1="30.6" y1="62" x2="28.2" y2="298"/>
      <line className="col-gold-line" x1="36.1" y1="62" x2="34.4" y2="298"/>
      <line className="col-gold-line" x1="41.7" y1="62" x2="40.7" y2="298"/>
      <line className="col-gold-line" x1="47.2" y1="62" x2="46.9" y2="298"/>
      <line className="col-gold-line" x1="52.8" y1="62" x2="53.1" y2="298"/>
      <line className="col-gold-line" x1="58.3" y1="62" x2="59.3" y2="298"/>
      <line className="col-gold-line" x1="63.9" y1="62" x2="65.6" y2="298"/>
      <line className="col-gold-line" x1="69.4" y1="62" x2="71.8" y2="298"/>
      <path className="col-gold-fill" d="M20 300 Q50 312 80 300 L82 318 Q50 326 18 318 Z"/>
      <path className="col-gold-stroke" d="M20 300 Q50 312 80 300"/>
      <path className="col-gold-stroke" d="M18 318 Q50 326 82 318"/>
      <path className="col-gold-fill" d="M14 318 Q50 330 86 318 L88 336 Q50 344 12 336 Z"/>
      <path className="col-gold-stroke" d="M14 318 Q50 330 86 318"/>
      <path className="col-gold-stroke" d="M12 336 Q50 344 88 336"/>
      <rect className="col-gold-fill" x="10" y="336" width="80" height="13"/>
      <path className="col-gold-stroke" d="M10 336 L90 336 L90 349 L10 349 Z"/>
      <rect className="col-gold-fill" x="5" y="349" width="90" height="12"/>
      <path className="col-gold-stroke" d="M5 349 L95 349 L95 361 L5 361 Z"/>
    </svg>
  )
}

export default function Pilares() {
  const colonnadRef = useRef(null)
  const groundRef = useRef(null)
  const sectionRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const colIO = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })

    colonnadRef.current.querySelectorAll('.pilar-col').forEach(el => colIO.observe(el))

    const groundIO = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) groundRef.current.classList.add('visible')
    }, { threshold: 0.3 })
    groundIO.observe(colonnadRef.current)

    const titleIO = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    sectionRef.current.querySelectorAll('.reveal').forEach(el => titleIO.observe(el))

    const colEl = colonnadRef.current
    const onScroll = () => {
      const cols = [...colEl.querySelectorAll('.pilar-col')]
      const center = colEl.scrollLeft + colEl.clientWidth / 2
      let closest = 0, minDist = Infinity
      cols.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setActiveIdx(closest)
    }
    colEl.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      colIO.disconnect(); groundIO.disconnect(); titleIO.disconnect()
      colEl.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section id="pilares" ref={sectionRef}>
      <div className="pilares-title reveal">
        <h2>Os 7 Pilares</h2>
        <p>O que sustenta cada projeto que entregamos</p>
      </div>

      <div className="colonnade" ref={colonnadRef}>
        {PILARES.map((p, i) => (
          <div key={p.num} className="pilar-col" style={{ transitionDelay: `${i * 0.12}s` }}>
            <ColumnSVG />
            <div className="pilar-label">
              <div className="pnum">{p.num}</div>
              <div className="pname">{p.name}</div>
              <div className="pdesc">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="colonnade-ground" ref={groundRef} />

      <div className="colonnade-dots">
        {PILARES.map((_, i) => (
          <span key={i} className={`colonnade-dot${i === activeIdx ? ' active' : ''}`} />
        ))}
      </div>
    </section>
  )
}
