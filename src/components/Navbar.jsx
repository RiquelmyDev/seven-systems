import { useEffect, useState } from 'react'
import logo from '/logo-7s.png'
import { makeWhatsAppLink, WHATSAPP_MESSAGES } from '../utils/whatsapp'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo" onClick={() => document.getElementById('hero').scrollIntoView()}>
          <img src={logo} alt="Seven Systems" />
        </div>
        <ul className="nav-links">
          <li><a href="#hero">Início</a></li>
          <li><a href="#quem-somos">Quem somos</a></li>
          <li><a href="#pilares">Pilares</a></li>
          <li><a href="#servicos">Serviços</a></li>
        </ul>
        <a
          href={makeWhatsAppLink(WHATSAPP_MESSAGES.navigation)}
          target="_blank"
          rel="noreferrer"
          className="nav-cta"
        >
          Falar com a gente
        </a>
        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <a href="#hero" onClick={close}>Início</a>
        <a href="#quem-somos" onClick={close}>Quem somos</a>
        <a href="#pilares" onClick={close}>Pilares</a>
        <a href="#servicos" onClick={close}>Serviços</a>
        <a
          href={makeWhatsAppLink(WHATSAPP_MESSAGES.navigation)}
          target="_blank"
          rel="noreferrer"
          className="nav-cta"
          style={{ textAlign: 'center' }}
        >
          Falar com a gente
        </a>
      </div>
    </>
  )
}
