'use client';

import { ThemeProvider } from './themes/ThemeProvider';
import { SECTION_REGISTRY } from './sections';
import { FooterSection } from './sections/footer/FooterSection';
import { SiteData } from './types';
import { TenantThemeData, DEFAULT_SECTIONS, DEFAULT_TOKENS } from './themes/tokens';

interface SiteRendererProps {
  data: SiteData;
  theme?: Partial<TenantThemeData>;
}

/**
 * Renderizador único do site do tenant. Usado tanto pela
 * landing pública quanto pelo editor visual (modo edição).
 *
 * Renderiza as seções na ordem definida em theme.sections,
 * injeta os tokens via ThemeProvider e adiciona o footer.
 */
export function SiteRenderer({ data, theme }: SiteRendererProps) {
  const tokens = theme?.tokens ?? DEFAULT_TOKENS;
  const sections = [...(theme?.sections ?? DEFAULT_SECTIONS)].sort((a, b) => a.order - b.order);

  return (
    <ThemeProvider tokens={tokens}>
      <div className="min-h-screen bg-site-bg text-site-text">
        {sections
          .filter((section) => section.visible)
          .map((section, index) => {
            const entry = SECTION_REGISTRY[section.type];
            if (!entry) return null;

            const SectionComponent = entry.component;
            return (
              <SectionComponent
                key={`${section.type}-${index}`}
                data={data}
                config={section}
              />
            );
          })}
        <FooterSection data={data} />
      </div>
    </ThemeProvider>
  );
}
