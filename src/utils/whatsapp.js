export const WHATSAPP_NUMBER = '5533998542884'

export const WHATSAPP_MESSAGES = {
  navigation: 'Ola! Vim pelo menu do site e quero entender qual servico da Seven Systems faz mais sentido para o meu negocio.',
  hero: 'Ola! Vim da area inicial do site e quero pedir uma analise da minha presenca digital.',
  final: 'Ola! Cheguei ao final da pagina e quero conversar sobre a melhor solucao para a imagem digital do meu negocio.',
  footer: 'Ola! Vim pelo rodape do site e quero falar com a Seven Systems sobre meu site e minha presenca digital.',
  landingPage: 'Ola! Tenho interesse na Landing Page da Seven Systems. Quero apresentar um servico principal e gerar mais contatos.',
  siteInstitucional: 'Ola! Tenho interesse no Site Institucional da Seven Systems. Quero organizar melhor a apresentacao da minha empresa.',
  presencaCompleta: 'Ola! Tenho interesse na Presenca Completa da Seven Systems. Quero estruturar melhor meu site e minha presenca digital.',
}

export function makeWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
