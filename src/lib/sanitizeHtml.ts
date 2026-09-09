import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'div', 'span'];
const ALLOWED_ATTR = ['style', 'class'];

/**
 * Sanitiza HTML gerado pelo editor inline.
 * Remove scripts e tags nao permitidas, mas preserva formatacao basica
 * (negrito, italico, quebras e alinhamento).
 */
export function sanitizeHtml(input: string, plainText = false): string {
  if (plainText) {
    return input.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true,
  });
}
