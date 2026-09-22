'use client';

import { useState } from 'react';
import { ThemeProvider } from './themes/ThemeProvider';
import { SECTION_REGISTRY } from './sections';
import { FooterSection } from './sections/footer/FooterSection';
import { SectionHoverToolbar } from '@/components/features/editor/SectionHoverToolbar';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { SiteData } from './types';
import { TenantThemeData, DEFAULT_SECTIONS, DEFAULT_TOKENS } from './themes/tokens';

interface SiteRendererProps {
  data: SiteData;
  theme?: Partial<TenantThemeData>;
  /** Modo edicao: envolve cada secao em uma area clicavel com highlight */
  editable?: boolean;
  /** Indice (em theme.sections) da secao selecionada no editor */
  selectedIndex?: number | null;
  onSelectSection?: (index: number) => void;
  /** Callback para edicao inline de conteudo (source: 'profile.displayName') */
  onUpdateContent?: (source: string, value: unknown) => void;
  /** Callback para atualizar overrides de uma secao */
  onUpdateSectionOverride?: (sectionIndex: number, key: string, value: unknown) => void;
  /** Callbacks de estrutura de secoes */
  onMoveSection?: (index: number, direction: 'up' | 'down') => void;
  onUpdateSection?: (index: number, patch: Record<string, unknown>) => void;
  onRemoveSection?: (index: number) => void;
  onReorderSections?: (from: number, to: number) => void;
}

/**
 * Renderizador unico do site do tenant. Usado tanto pela
 * landing publica quanto pelo editor visual (modo edicao).
 *
 * Renderiza as secoes na ordem definida em theme.sections,
 * injeta os tokens via ThemeProvider e adiciona o footer.
 */
export function SiteRenderer({
  data,
  theme,
  editable = false,
  selectedIndex = null,
  onSelectSection,
  onUpdateContent,
  onUpdateSectionOverride,
  onMoveSection,
  onUpdateSection,
  onRemoveSection,
  onReorderSections,
}: SiteRendererProps) {
  const tokens = theme?.tokens ?? DEFAULT_TOKENS;
  const ordered = [...(theme?.sections ?? DEFAULT_SECTIONS)];
  const sorted = ordered
    .map((section, originalIndex) => ({ section, originalIndex }))
    .sort((a, b) => a.section.order - b.section.order);

  const [dragged, setDragged] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('before');

  // CTA fixo no mobile (não no editor): WhatsApp se configurado,
  // senão rola para a seção de contato.
  const stickyCtaLink = editable ? null : getWhatsAppLink(data.settings?.whatsappNumber);

  return (
    <ThemeProvider tokens={tokens}>
      <div
        className={`min-h-screen w-full overflow-x-hidden bg-site-bg text-site-text ${
          !editable ? 'pb-16 md:pb-0' : ''
        }`}
      >
        {sorted
          .filter(({ section }) => editable || section.visible)
          .map(({ section, originalIndex }, sortedIndex) => {
            const entry = SECTION_REGISTRY[section.type];
            if (!entry) return null;

            const SectionComponent = entry.component;
            const isSelected = editable && selectedIndex === originalIndex;

            const rendered = (
              <SectionComponent
                key={`${section.type}-${originalIndex}`}
                data={data}
                config={section}
                sectionIndex={originalIndex}
                editable={editable}
                onUpdateContent={onUpdateContent}
                onUpdateSectionOverride={onUpdateSectionOverride}
              />
            );

            if (!editable) return rendered;

            return (
              <div
                key={`${section.type}-${originalIndex}`}
                data-section-index={originalIndex}
                aria-label={`Secao: ${entry.schema.name}`}
                className={`group relative transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent'
                    : ''
                } ${!section.visible ? 'opacity-40 grayscale' : ''} ${
                  dragged === sortedIndex ? 'opacity-30' : ''
                } ${
                  dropTarget === sortedIndex
                    ? dropPosition === 'before'
                      ? 'border-t-4 border-acolha-accent'
                      : 'border-b-4 border-acolha-accent'
                    : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  const pos = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
                  setDropTarget(sortedIndex);
                  setDropPosition(pos);
                }}
                onDragLeave={() => {
                  setDropTarget(null);
                  setDropPosition('before');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragged !== null && dragged !== sortedIndex) {
                    const target = dropPosition === 'before' ? sortedIndex : sortedIndex + 1;
                    onReorderSections?.(dragged, target);
                  }
                  setDragged(null);
                  setDropTarget(null);
                  setDropPosition('before');
                }}
              >
                <div
                  data-section-toolbar
                  className={`absolute right-2 top-2 z-30 transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <SectionHoverToolbar
                    isVisible={section.visible}
                    canMoveUp={sortedIndex > 0}
                    canMoveDown={sortedIndex < sorted.length - 1}
                    onMoveUp={() => onMoveSection?.(originalIndex, 'up')}
                    onMoveDown={() => onMoveSection?.(originalIndex, 'down')}
                    onToggleVisibility={() => onUpdateSection?.(originalIndex, { visible: !section.visible })}
                    onRemove={() => onRemoveSection?.(originalIndex)}
                    onEdit={() => onSelectSection?.(originalIndex)}
                    onDragStart={() => setDragged(sortedIndex)}
                    onDragEnd={() => {
                      setDragged(null);
                      setDropTarget(null);
                    }}
                  />
                </div>
                <div
                  className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-xs font-medium transition-opacity ${
                    isSelected ? 'bg-blue-500 text-white opacity-100' : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {entry.schema.name}
                  {!section.visible && ' (oculta)'}
                </div>
                {rendered}
              </div>
            );
          })}
        <FooterSection data={data} editable={editable} onUpdateContent={onUpdateContent} />
      </div>
      {!editable && (
        <a
          href={stickyCtaLink ?? '#contact'}
          {...(stickyCtaLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden flex items-center justify-center gap-2 bg-site-primary text-site-bg font-medium py-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Agendar Consulta
        </a>
      )}
    </ThemeProvider>
  );
}
