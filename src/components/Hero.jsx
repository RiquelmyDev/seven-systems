import { useEffect, useRef, useState } from 'react'
import logo from '/logo-7s.png'
import { makeWhatsAppLink, WHATSAPP_MESSAGES } from '../utils/whatsapp'

export default function Hero() {
  const canvasRef = useRef(null)
  const logoWrapRef = useRef(null)
  const heroRightRef = useRef(null)
  const sectionRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 900px)').matches
  })
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData ?? false
    return reduceMotion || saveData
  })

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMode = () => {
      const saveData = navigator.connection?.saveData ?? false
      setIsMobile(mobileQuery.matches)
      setReducedMotion(motionQuery.matches || saveData)
    }

    updateMode()
    mobileQuery.addEventListener('change', updateMode)
    motionQuery.addEventListener('change', updateMode)
    return () => {
      mobileQuery.removeEventListener('change', updateMode)
      motionQuery.removeEventListener('change', updateMode)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      if (disposed || !canvas) return

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5))
      renderer.setClearColor(0x080808, 1)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
      camera.position.z = 7

      const VERT = `
        attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vColor = aColor; vAlpha = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (34.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `
      const FRAG = `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.0, d) * vAlpha;
          if (a < 0.004) discard;
          gl_FragColor = vec4(vColor, a);
        }
      `
      function makeMat(bl) {
        return new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
          blending: bl,
        })
      }

      const REST = [
        new THREE.Vector3(-3.5, -3.0, 0.0),
        new THREE.Vector3(-1.5, 1.5, 0.5),
        new THREE.Vector3(-0.2, -0.5, -0.4),
        new THREE.Vector3(1.2, 1.2, 0.4),
        new THREE.Vector3(2.0, -1.0, -0.3),
        new THREE.Vector3(3.5, 2.5, 0.0),
      ]
      const ctrl = REST.map(p => p.clone())
      const curve = new THREE.CatmullRomCurve3(ctrl, false, 'catmullrom', 0.5)

      const LUT = 360
      const lut = new Array(LUT + 1)
      function rebuildLUT() {
        for (let i = 0; i <= LUT; i++) lut[i] = curve.getPoint(i / LUT)
      }
      rebuildLUT()

      const _va = new THREE.Vector3()
      const _vb = new THREE.Vector3()
      const _pos = new THREE.Vector3()
      const _rgt = new THREE.Vector3()
      const _prp = new THREE.Vector3()
      const _up = new THREE.Vector3(0, 1, 0)

      function sampleCurve(t, out) {
        const f = Math.max(0, Math.min(1, t)) * LUT
        const i0 = Math.floor(f)
        const i1 = Math.min(i0 + 1, LUT)
        const fr = f - i0
        const a = lut[i0]
        const b = lut[i1]
        out.set(a.x + (b.x - a.x) * fr, a.y + (b.y - a.y) * fr, a.z + (b.z - a.z) * fr)
      }

      function buildFrame(t, op, or2, op2) {
        sampleCurve(t, op)
        sampleCurve(Math.min(t + 0.003, 1), _vb)
        const _tan = new THREE.Vector3().subVectors(_vb, op).normalize()
        or2.crossVectors(_tan, _up).normalize()
        op2.crossVectors(or2, _tan).normalize()
      }

      const lc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
      const WHITE = [0.97, 0.93, 1.0]
      const NEON = [0.61, 0.19, 1.0]
      const MID = [0.42, 0.08, 0.8]
      const DEEP = [0.26, 0.0, 0.47]
      const colA = t => (t < 0.5 ? lc(WHITE, NEON, t * 2) : lc(NEON, MID, (t - 0.5) * 2))
      const colB = t => (t < 0.5 ? lc(NEON, MID, t * 2) : lc(MID, DEEP, (t - 0.5) * 2))
      const colC = t => (t < 0.5 ? lc(NEON, MID, t * 2) : lc(MID, DEEP, (t - 0.5) * 2))

      function buildLayer(n, ribbonR, szMin, szMax, alMin, alMax, colFn, blending, dustFrac = 0) {
        const pos = new Float32Array(n * 3)
        const col = new Float32Array(n * 3)
        const sz = new Float32Array(n)
        const alpha = new Float32Array(n)
        const pT = new Float32Array(n)
        const pSpd = new Float32Array(n)
        const pRX = new Float32Array(n)
        const pRY = new Float32Array(n)
        const pRZ = new Float32Array(n)
        const dX = new Float32Array(n)
        const dY = new Float32Array(n)
        const dZ = new Float32Array(n)
        const dustStart = Math.floor(n * (1 - dustFrac))

        for (let i = 0; i < n; i++) {
          pT[i] = Math.random()
          pSpd[i] = 0.012 + Math.random() * 0.04
          if (i >= dustStart) {
            pRX[i] = (Math.random() - 0.5) * 7
            pRY[i] = (Math.random() - 0.5) * 8
            pRZ[i] = (Math.random() - 0.5) * 3
          } else {
            const r = Math.pow(Math.random(), 0.6) * ribbonR
            const ang = Math.random() * Math.PI * 2
            pRX[i] = Math.cos(ang) * r
            pRY[i] = Math.sin(ang) * r
            pRZ[i] = (Math.random() - 0.5) * 0.5
          }
          sz[i] = szMin + Math.random() * (szMax - szMin)
          alpha[i] = alMin + Math.random() * (alMax - alMin)
          const t3 = Math.min(Math.abs(pRX[i]) / (ribbonR + 0.001), 1)
          const c = colFn(t3)
          col[i * 3] = c[0]
          col[i * 3 + 1] = c[1]
          col[i * 3 + 2] = c[2]
        }

        const geo = new THREE.BufferGeometry()
        const posA = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)
        geo.setAttribute('position', posA)
        geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
        geo.setAttribute('aSize', new THREE.BufferAttribute(sz, 1))
        geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
        const pts = new THREE.Points(geo, makeMat(blending))
        scene.add(pts)
        return { posA, pos, pT, pSpd, pRX, pRY, pRZ, dX, dY, dZ, n, points: pts }
      }

      const layerScale = isMobile ? 0.35 : 1
      const lA = buildLayer(Math.round(420 * layerScale), 0.18, 0.8, 2.0, 0.14, 0.3, colA, THREE.AdditiveBlending)
      const lB = buildLayer(Math.round(960 * layerScale), 0.65, 0.6, 1.6, 0.06, 0.14, colB, THREE.AdditiveBlending)
      const lC = buildLayer(Math.round(1800 * layerScale), 1.4, 0.4, 1.8, 0.5, 0.9, colC, THREE.NormalBlending, 0.14)
      lC.points.renderOrder = 0
      lB.points.renderOrder = 1
      lA.points.renderOrder = 2
      const layers = [lA, lB, lC]

      function resize() {
        const p = canvas.parentElement
        const w = p.clientWidth
        const h = p.clientHeight
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }

      resize()
      window.addEventListener('resize', resize)

      const rawM = { x: 0, y: 0 }
      const smlM = { x: 0, y: 0 }
      const m3D = new THREE.Vector3(9999, 9999, 0)
      const onMouseMove = e => {
        rawM.x = (e.clientX / window.innerWidth - 0.5) * 2
        rawM.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      if (!isMobile) {
        window.addEventListener('mousemove', onMouseMove)
      }

      function updateM3D() {
        _va.set(smlM.x, smlM.y, 0.5).unproject(camera)
        _vb.copy(_va).sub(camera.position).normalize()
        const t = -camera.position.z / _vb.z
        m3D.copy(camera.position).addScaledVector(_vb, t)
      }

      const clock = new THREE.Clock()
      const LERP = 0.05
      const WEIGHTS = [0, 0.2, 0.55, 0.55, 0.2, 0]
      const REPEL_R = 1.4
      const REPEL_F = 0.08
      const FRICTION = 0.88

      function updateLayer(L, dt) {
        for (let i = 0; i < L.n; i++) {
          L.pT[i] = (L.pT[i] + L.pSpd[i] * dt) % 1
          buildFrame(L.pT[i], _pos, _rgt, _prp)
          const ox = L.pRX[i]
          const oy = L.pRY[i]
          const oz = L.pRZ[i]
          const bx = _pos.x + _rgt.x * ox + _prp.x * oy
          const by = _pos.y + _rgt.y * ox + _prp.y * oy + oz
          const bz = _pos.z + _rgt.z * ox + _prp.z * oy
          const dx = bx - m3D.x
          const dy = by - m3D.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < REPEL_R && dist > 0.001) {
            const f = Math.pow(1 - dist / REPEL_R, 1.5) * REPEL_F
            L.dX[i] += (dx / dist) * f
            L.dY[i] += (dy / dist) * f
            L.dZ[i] += (Math.random() - 0.5) * f * 0.3
          }
          L.dX[i] *= FRICTION
          L.dY[i] *= FRICTION
          L.dZ[i] *= FRICTION
          L.pos[i * 3] = bx + L.dX[i]
          L.pos[i * 3 + 1] = by + L.dY[i]
          L.pos[i * 3 + 2] = bz + L.dZ[i]
        }
        L.posA.needsUpdate = true
      }

      let isVisible = true
      const visIO = new IntersectionObserver(([e]) => {
        isVisible = e.isIntersecting
      }, { threshold: 0 })
      visIO.observe(sectionRef.current)

      let animId
      function animate() {
        animId = requestAnimationFrame(animate)
        if (!isVisible) return
        const dt = Math.min(clock.getDelta(), 0.05)
        smlM.x += (rawM.x - smlM.x) * LERP
        smlM.y += (rawM.y - smlM.y) * LERP
        updateM3D()
        for (let k = 0; k < ctrl.length; k++) {
          const w = WEIGHTS[k]
          if (!w) continue
          const tx = REST[k].x + (m3D.x - REST[k].x) * w * 0.4
          const ty = REST[k].y + (m3D.y - REST[k].y) * w * 0.4
          ctrl[k].x += (tx - ctrl[k].x) * LERP * 0.5
          ctrl[k].y += (ty - ctrl[k].y) * LERP * 0.5
        }
        rebuildLUT()
        layers.forEach(L => updateLayer(L, dt))
        renderer.render(scene, camera)
      }
      animate()

      cleanup = () => {
        cancelAnimationFrame(animId)
        visIO.disconnect()
        window.removeEventListener('resize', resize)
        if (!isMobile) {
          window.removeEventListener('mousemove', onMouseMove)
        }
        renderer.dispose()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [isMobile, reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const logoWrap = logoWrapRef.current
    const heroRight = heroRightRef.current
    if (!logoWrap || !heroRight) return

    const onEnter = () => { logoWrap.style.transition = 'transform 0.08s ease-out' }
    const onMove = e => {
      const r = heroRight.getBoundingClientRect()
      const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2)
      const tX = dy * -16, tY = dx * 16
      const mX = dx * 14,  mY = dy * 14
      logoWrap.style.transform =
        `translate(calc(-50% + ${mX}px), calc(-50% + ${mY}px)) perspective(700px) rotateX(${tX}deg) rotateY(${tY}deg)`
    }
    const onLeave = () => {
      logoWrap.style.transition = 'transform 0.7s cubic-bezier(.22,1,.36,1)'
      logoWrap.style.transform  = 'translate(-50%, -50%)'
      setTimeout(() => { logoWrap.style.transition = '' }, 720)
    }

    heroRight.addEventListener('mouseenter', onEnter)
    heroRight.addEventListener('mousemove', onMove)
    heroRight.addEventListener('mouseleave', onLeave)
    return () => {
      heroRight.removeEventListener('mouseenter', onEnter)
      heroRight.removeEventListener('mousemove', onMove)
      heroRight.removeEventListener('mouseleave', onLeave)
    }
  }, [reducedMotion])

  return (
    <section id="hero" ref={sectionRef} className={reducedMotion ? 'hero-static' : ''}>
      <div className="hero-left">
        <div className="hero-eyebrow">Seven Systems</div>
        <h1 className="hero-headline">
          Seu negócio<br />mais forte online.<br /><em>Mais claro. Mais confiável. Mais escolhido.</em>
        </h1>
        <p className="hero-sub">
          Criamos páginas, sites e estruturas digitais para negócios locais que precisam transformar atenção em contato e contato em venda.
        </p>
        <div className="hero-btns">
          <a
            href={makeWhatsAppLink(WHATSAPP_MESSAGES.hero)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Pedir uma análise
          </a>
          <a href="#servicos" className="btn-secondary">Ver soluções</a>
        </div>
      </div>

      <div className={`hero-right${reducedMotion ? ' is-static' : ''}`} ref={heroRightRef}>
        {reducedMotion ? <div className="hero-static-bg" aria-hidden="true" /> : <canvas id="hero-canvas" ref={canvasRef} />}
        <div className="hero-logo-wrap" ref={logoWrapRef}>
          <img src={logo} alt="Seven Systems" className="hero-logo-img" />
        </div>
      </div>

      <div className="hero-scroll-hint">scroll</div>
    </section>
  )
}
