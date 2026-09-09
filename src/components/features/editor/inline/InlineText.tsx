'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'a' | 'label' | 'li';

interface InlineTextProps {
  as?: TextTag;
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  /** Se true, permite negrito/italico/alinhamento. Padrao: mesma coisa que multiline. */
  richText?: boolean;
  'aria-label'?: string;
}

/**
 * Componente de texto editavel inline com suporte a negrito, italico e alinhamento.
 * Quando `editable=true`, o usuario pode clicar, editar e aplicar formatacao.
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
  richText,
  'aria-label': ariaLabel,
}: InlineTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ top?: number; bottom?: number; left: number } | null>(null);
  const isMobile = useIsMobile();
  const isRich = richText !== undefined ? richText : multiline;

  // Sincroniza com a prop externa quando nao esta editando.
  useEffect(() => {
    if (ref.current && !isEditing && ref.current.innerHTML !== value) {
      ref.current.innerHTML = isRich ? (value || placeholder || '') : (value || placeholder || '');
    }
  }, [value, isEditing, placeholder, isRich]);

  const Tag = as;

  if (!editable) {
    if (!isRich) {
      return (
        <Tag className={className}>{value || placeholder}</Tag>
      ) as React.ReactNode;
    }
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(value || placeholder || '') }}
      />
    ) as React.ReactNode;
  }

  const commit = () => {
    setIsEditing(false);
    setShowToolbar(false);
    const raw = ref.current?.innerHTML || '';
    const next = isRich ? sanitizeHtml(raw) : sanitizeHtml(raw, true);
    if (next !== value) onChange?.(next);
  };

  const handleFocus = () => {
    setIsEditing(true);
    if (isRich) positionToolbar();
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Se o foco foi para a toolbar, nao comita
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
      if (ref.current) ref.current.innerHTML = isRich ? (value || placeholder || '') : (value || placeholder || '');
      (e.target as HTMLElement).blur();
    }
  };

  const handleInput = () => {
    if (isRich) positionToolbar();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRich) positionToolbar();
  };

  const positionToolbar = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (isMobile) {
      setToolbarPos({
        bottom: 16,
        left: Math.max(8, Math.min(window.innerWidth - 240, window.innerWidth / 2 - 120)),
      });
    } else {
      setToolbarPos({
        top: Math.max(8, rect.top - 48 + window.scrollY),
        left: Math.max(8, Math.min(window.innerWidth - 240, rect.left + rect.width / 2 - 110)),
      });
    }
    setShowToolbar(true);
  };

  const exec = (command: 'bold' | 'italic' | 'justifyLeft' | 'justifyCenter' | 'justifyRight') => {
    if (!isRich) return;
    document.execCommand(command, false);
    if (ref.current) {
      ref.current.focus();
      const next = sanitizeHtml(ref.current.innerHTML);
      onChange?.(next);
    }
  };

  const isActive = (command: string) => {
    if (typeof document === 'undefined' || !isRich) return false;
    return document.queryCommandState(command);
  };

  return (
    <>
      <Tag
        ref={ref as any}
        className={className}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline={multiline}
        aria-label={ariaLabel || placeholder || 'Texto editavel'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: isRich ? (value || placeholder || '') : (value || placeholder || '') }}
      />
      {showToolbar && isRich && toolbarPos && (
        <div
          data-inline-toolbar
          className="fixed z-[100] flex items-center gap-1 rounded-full border border-acolha-line bg-white px-3 py-2 shadow-lg"
          style={{ top: toolbarPos.top, bottom: toolbarPos.bottom, left: toolbarPos.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ToolbarButton active={isActive('bold')} onClick={() => exec('bold')} label="Negrito">
            B
          </ToolbarButton>
          <ToolbarButton active={isActive('italic')} onClick={() => exec('italic')} label="Italico">
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
