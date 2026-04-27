import logo from '/logo-7s.png'
import { makeWhatsAppLink, WHATSAPP_MESSAGES } from '../utils/whatsapp'

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand-col">
        <img src={logo} alt="Seven Systems" className="footer-logo-img" />
        <div className="footer-tagline">Presenca digital para negocios locais</div>
        <div className="footer-copy">© 2026 Seven Systems. Vale do Aço, MG.</div>
      </div>
      <ul className="footer-nav">
        <li><a href="#hero">Início</a></li>
        <li><a href="#quem-somos">Quem somos</a></li>
        <li><a href="#pilares">Os 7 Pilares</a></li>
        <li><a href="#servicos">Serviços</a></li>
      </ul>
      <div className="footer-contact">
        <a href={makeWhatsAppLink(WHATSAPP_MESSAGES.footer)} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </footer>
  )
}
