export const DEFAULT_WHATSAPP_MESSAGE =
  'Olá, vim pelo Acolha e gostaria de agendar uma sessão.';

/**
 * Monta link wa.me com mensagem pré-preenchida.
 * Retorna null se não houver número configurado.
 */
export function getWhatsAppLink(
  number: string | null | undefined,
  message: string = DEFAULT_WHATSAPP_MESSAGE
): string | null {
  const digits = number?.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
