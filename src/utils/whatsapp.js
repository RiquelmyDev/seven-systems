export const WHATSAPP_NUMBER = '5533998542884'

export const WHATSAPP_MESSAGES = {
  generic: 'Ola! Vim pelo site da Seven Systems e quero entender como melhorar a presenca digital do meu negocio.',
  navigation: 'Ola! Naveguei pelo site da Seven Systems e quero entender qual solucao faz mais sentido para o meu negocio.',
  hero: 'Ola! Quero pedir uma analise da minha presenca digital.',
  final: 'Ola! Quero conversar sobre como melhorar a apresentacao digital do meu negocio.',
  footer: 'Ola! Quero falar com a Seven Systems sobre meu site e minha presenca digital.',
}

export function makeWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
