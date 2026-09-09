import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('preserva negrito e italico', () => {
    const input = '<p><strong>negrito</strong> e <em>italico</em></p>';
    expect(sanitizeHtml(input)).toContain('<strong>negrito</strong>');
    expect(sanitizeHtml(input)).toContain('<em>italico</em>');
  });

  it('remove scripts e eventos', () => {
    const input = '<p onclick="alert(1)">oi</p><script>alert(1)</script>';
    const out = sanitizeHtml(input);
    expect(out).not.toContain('<script>');
    expect(out).not.toContain('onclick');
    expect(out).toContain('oi');
  });

  it('plain text remove tags', () => {
    const input = '<p>texto <strong>negrito</strong></p>';
    expect(sanitizeHtml(input, true)).toBe('texto negrito');
  });
});
