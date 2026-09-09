'use client';

import { useEffect, useRef, useState } from 'react';

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'a' | 'label' | 'li';

interface InlineTextProps {
  as?: TextTag;
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  multiline?: boolean;
  placeholder?: string;
}

/**
 * Componente de texto editável inline com suporte a negrito, itálico e alinhamento.
 * Quando `editable=true`, o usuário pode clicar, editar e aplicar formatação.
 * Salva no `onBlur`.
 */
export function InlineText({
  as = 'span',
  className,
  value,
  onChange,
  editable,
  multiline,
  placeholder,
}: InlineTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  // Sincroniza com a prop externa quando não está editando.
  useEffect(() => {
    if (ref.current && !isEditing && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || placeholder || '';
    }
  }, [value, isEditing, placeholder]);

  const Tag = as;

  if (!editable) {
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: value || placeholder || '' }}
      />
    ) as React.ReactNode;
  }

  const commit = () => {
    setIsEditing(false);
    setShowToolbar(false);
    const next = ref.current?.innerHTML || '';
    if (next !== value) onChange?.(next);
  };

  const handleFocus = () => {
    setIsEditing(true);
    positionToolbar();
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Se o foco foi para a toolbar, não comita
    const related = e.relatedTarget as HTMLElement | null;
    if (related?.closest('[data-inline-toolbar]')) {
      return;
    }
    commit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ref.current) ref.current.innerHTML = value || placeholder || '';
      (e.target as HTMLElement).blur();
    }
  };

  const handleInput = () => {
    positionToolbar();
  };

  const positionToolbar = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setToolbarPos({
      top: Math.max(8, rect.top - 48 + window.scrollY),
      left: Math.max(8, Math.min(window.innerWidth - 220, rect.left + rect.width / 2 - 110)),
    });
    setShowToolbar(true);
  };

  const exec = (command: 'bold' | 'italic' | 'justifyLeft' | 'justifyCenter' | 'justifyRight') => {
    document.execCommand(command, false);
    if (ref.current) {
      ref.current.focus();
      onChange?.(ref.current.innerHTML);
    }
  };

  const isActive = (command: string) => {
    if (typeof document === 'undefined') return false;
    return document.queryCommandState(command);
  };

  return (
    <>
      <Tag
        ref={ref as any}
        className={className}
        contentEditable
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onClick={positionToolbar}
        dangerouslySetInnerHTML={{ __html: value || placeholder || '' }}
      />
      {showToolbar && toolbarPos && (
        <div
          data-inline-toolbar
          className="fixed z-[100] flex items-center gap-1 rounded-full border border-acolha-line bg-white px-3 py-2 shadow-lg"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ToolbarButton active={isActive('bold')} onClick={() => exec('bold')} label="Negrito">
            B
          </ToolbarButton>
          <ToolbarButton active={isActive('italic')} onClick={() => exec('italic')} label="Itálico">
            I
          </ToolbarButton>
          <div className="mx-1 h-4 w-px bg-acolha-line" />
          <ToolbarButton onClick={() => exec('justifyLeft')} label="Alinhar esquerda">
            ←
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('justifyCenter')} label="Centralizar">
            ↔
          </ToolbarButton>
          <ToolbarButton onClick={() => exec('justifyRight')} label="Alinhar direita">
            →
          </ToolbarButton>
        </div>
      )}
    </>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
        active
          ? 'bg-acolha-accent text-white'
          : 'text-acolha-ink hover:bg-acolha-mist'
      }`}
    >
      {children}
    </button>
  );
}
