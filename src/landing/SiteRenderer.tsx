'use client';

import { useState } from 'react';
import { ThemeProvider } from './themes/ThemeProvider';
import { SECTION_REGISTRY } from './sections';
import { FooterSection } from './sections/footer/FooterSection';
import { SectionHoverToolbar } from '@/components/features/editor/SectionHoverToolbar';
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

  return (
    <ThemeProvider tokens={tokens}>
      <div className="min-h-screen w-full overflow-x-hidden bg-site-bg text-site-text">
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
    </ThemeProvider>
  );
}
