'use client';

import { ThemeProvider } from './themes/ThemeProvider';
import { SECTION_REGISTRY } from './sections';
import { FooterSection } from './sections/footer/FooterSection';
import { SiteData } from './types';
import { TenantThemeData, DEFAULT_SECTIONS, DEFAULT_TOKENS } from './themes/tokens';

interface SiteRendererProps {
  data: SiteData;
  theme?: Partial<TenantThemeData>;
  /** Modo edição: envolve cada seção em uma área clicável com highlight */
  editable?: boolean;
  /** Índice (em theme.sections) da seção selecionada no editor */
  selectedIndex?: number | null;
  onSelectSection?: (index: number) => void;
}

/**
 * Renderizador único do site do tenant. Usado tanto pela
 * landing pública quanto pelo editor visual (modo edição).
 *
 * Renderiza as seções na ordem definida em theme.sections,
 * injeta os tokens via ThemeProvider e adiciona o footer.
 */
export function SiteRenderer({
  data,
  theme,
  editable = false,
  selectedIndex = null,
  onSelectSection,
}: SiteRendererProps) {
  const tokens = theme?.tokens ?? DEFAULT_TOKENS;
  const ordered = [...(theme?.sections ?? DEFAULT_SECTIONS)];
  const sorted = ordered
    .map((section, originalIndex) => ({ section, originalIndex }))
    .sort((a, b) => a.section.order - b.section.order);

  return (
    <ThemeProvider tokens={tokens}>
      <div className="min-h-screen bg-site-bg text-site-text">
        {sorted
          .filter(({ section }) => editable || section.visible)
          .map(({ section, originalIndex }) => {
            const entry = SECTION_REGISTRY[section.type];
            if (!entry) return null;

            const SectionComponent = entry.component;
            const isSelected = editable && selectedIndex === originalIndex;

            const rendered = (
              <SectionComponent
                key={`${section.type}-${originalIndex}`}
                data={data}
                config={section}
              />
            );

            if (!editable) return rendered;

            return (
              <div
                key={`${section.type}-${originalIndex}`}
                onClick={() => onSelectSection?.(originalIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSection?.(originalIndex);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Editar seção: ${entry.schema.name}`}
                aria-pressed={isSelected}
                className={`relative cursor-pointer transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent'
                    : 'hover:ring-2 hover:ring-blue-400/50'
                } ${!section.visible ? 'opacity-40 grayscale' : ''}`}
              >
                <div
                  className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-xs font-medium transition-opacity ${
                    isSelected ? 'bg-blue-500 text-white opacity-100' : 'bg-black/60 text-white opacity-0 hover:opacity-100'
                  }`}
                >
                  {entry.schema.name}
                  {!section.visible && ' (oculta)'}
                </div>
                {rendered}
              </div>
            );
          })}
        <FooterSection data={data} />
      </div>
    </ThemeProvider>
  );
}
