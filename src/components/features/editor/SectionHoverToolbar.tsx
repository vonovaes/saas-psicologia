'use client';

import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';

interface SectionHoverToolbarProps {
  isVisible: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onAdd?: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, position: 'before' | 'after') => void;
  onDrop: (e: React.DragEvent) => void;
}

export function SectionHoverToolbar({
  isVisible,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onRemove,
  onAdd,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: SectionHoverToolbarProps) {
  return (
    <div
      className="absolute right-2 top-2 z-30 flex items-center gap-1 rounded-full border border-acolha-line bg-white/95 px-2 py-1 shadow-lg backdrop-blur-sm"
      onDragOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
        onDragOver(e, position);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e);
      }}
    >
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="cursor-grab p-1.5 text-acolha-muted hover:text-acolha-ink"
        title="Arrastar para reordenar"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="rounded-full p-1.5 text-acolha-muted transition-colors hover:bg-acolha-mist hover:text-acolha-ink disabled:opacity-30"
        title="Mover para cima"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="rounded-full p-1.5 text-acolha-muted transition-colors hover:bg-acolha-mist hover:text-acolha-ink disabled:opacity-30"
        title="Mover para baixo"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onToggleVisibility}
        className="rounded-full p-1.5 text-acolha-muted transition-colors hover:bg-acolha-mist hover:text-acolha-ink"
        title={isVisible ? 'Ocultar' : 'Exibir'}
      >
        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-50"
        title="Remover"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="ml-1 rounded-full bg-acolha-accent px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-acolha-accent-hover"
          title="Adicionar seção"
        >
          +
        </button>
      )}
    </div>
  );
}
