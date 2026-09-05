'use client';

import { useState } from 'react';
import { SECTION_REGISTRY } from '@/landing/sections';
import { SectionConfig, SectionType } from '@/landing/themes/tokens';

interface SectionListProps {
  sections: SectionConfig[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onRemove: (index: number) => void;
  onToggleVisible: (index: number, visible: boolean) => void;
  onAdd: (type: SectionType, variant: string) => void;
}

/**
 * Lista lateral de seções: seleção, reordenação, visibilidade,
 * remoção e adição de novas seções do registry.
 */
export function SectionList({
  sections,
  selectedIndex,
  onSelect,
  onMove,
  onRemove,
  onToggleVisible,
  onAdd,
}: SectionListProps) {
  const [showAdd, setShowAdd] = useState(false);

  const sorted = sections
    .map((s, i) => ({ s, i }))
    .sort((a, b) => a.s.order - b.s.order);

  const presentTypes = new Set(sections.map((s) => s.type));
  const availableToAdd = Object.entries(SECTION_REGISTRY).filter(
    ([type]) => !presentTypes.has(type as SectionType)
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Clique numa seção para editar ou reordene com as setas.
      </p>

      <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
        {sorted.map(({ s, i }, pos) => {
          const name = SECTION_REGISTRY[s.type]?.schema.name ?? s.type;
          return (
            <div
              key={i}
              className={`flex items-center gap-1 px-2 py-2 ${
                selectedIndex === i ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col">
                <button
                  onClick={() => onMove(i, 'up')}
                  disabled={pos === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-20 text-xs leading-none"
                >
                  ▲
                </button>
                <button
                  onClick={() => onMove(i, 'down')}
                  disabled={pos === sorted.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-20 text-xs leading-none"
                >
                  ▼
                </button>
              </div>
              <button
                onClick={() => onSelect(i)}
                className={`flex-1 text-left text-sm px-1 ${
                  !s.visible ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {name}
              </button>
              <button
                onClick={() => onToggleVisible(i, !s.visible)}
                title={s.visible ? 'Ocultar' : 'Mostrar'}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                {s.visible ? '👁' : '—'}
              </button>
              <button
                onClick={() => onRemove(i)}
                title="Remover seção"
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Adicionar seção */}
      <div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-full py-2 text-sm font-medium text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
        >
          + Adicionar seção
        </button>
        {showAdd && (
          <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100">
            {availableToAdd.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                Todas as seções disponíveis já foram adicionadas.
              </p>
            ) : (
              availableToAdd.map(([type, mod]) => (
                <button
                  key={type}
                  onClick={() => {
                    onAdd(type as SectionType, mod!.schema.variants[0]?.id ?? 'default');
                    setShowAdd(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                >
                  <span className="block text-sm font-medium text-gray-800">
                    {mod!.schema.name}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {mod!.schema.description}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
