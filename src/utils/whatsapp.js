export const WHATSAPP_NUMBER = '5533998542884'

export const WHATSAPP_MESSAGES = {
  generic: 'Olá! Vim pelo site da Seven Systems e quero conversar sobre meu projeto.',
  navigation: 'Olá! Naveguei pelo site da Seven Systems e quero entender a melhor solução para meu negócio.',
  hero: 'Olá! Vim da seção inicial e quero criar um site profissional para minha empresa.',
  final: 'Olá! Cheguei ao final do site e quero receber uma proposta para meu negócio.',
  footer: 'Olá! Quero falar com a Seven Systems sobre presença digital.',
}

export function makeWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
