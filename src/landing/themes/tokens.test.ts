import { describe, it, expect } from 'vitest';
import { mergeSectionsPreservingEdits } from './tokens';
import type { SectionConfig } from './tokens';

const makeSection = (
  type: SectionConfig['type'],
  order: number,
  overrides: Record<string, unknown> = {},
  visible = true,
): SectionConfig => ({ type, variant: 'default', visible, order, overrides });

describe('mergeSectionsPreservingEdits', () => {
  it('preserva overrides e visibilidade de secoes do mesmo tipo', () => {
    const prev = [
      makeSection('hero', 0, { eyebrow: 'Psiquiatria', ctaText: 'Fale comigo' }),
      makeSection('faq', 1, { title: 'Dúvidas comuns' }, false),
    ];
    const next = [
      makeSection('hero', 0, { eyebrow: 'Psicologia Clínica' }),
      makeSection('faq', 1),
    ];

    const merged = mergeSectionsPreservingEdits(prev, next);

    expect(merged[0].overrides).toEqual({
      eyebrow: 'Psiquiatria',
      ctaText: 'Fale comigo',
    });
    expect(merged[1].overrides).toEqual({ title: 'Dúvidas comuns' });
    expect(merged[1].visible).toBe(false);
  });

  it('mantem o preset intacto para secoes novas', () => {
    const prev = [makeSection('hero', 0)];
    const next = [makeSection('hero', 0), makeSection('map', 1)];

    const merged = mergeSectionsPreservingEdits(prev, next);

    expect(merged[1].type).toBe('map');
    expect(merged[1].overrides).toEqual({});
    expect(merged[1].visible).toBe(true);
  });

  it('ignora secoes removidas que nao existem no novo preset', () => {
    const prev = [
      makeSection('hero', 0, { eyebrow: 'X' }),
      makeSection('testimonials', 1, { title: 'Depoimentos' }),
    ];
    const next = [makeSection('hero', 0)];

    const merged = mergeSectionsPreservingEdits(prev, next);

    expect(merged).toHaveLength(1);
    expect(merged[0].type).toBe('hero');
  });
});
