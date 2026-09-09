'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { TiptapText } from './TiptapText';

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
 * Componente de texto editavel inline.
 * - Sem formatacao: contentEditable simples.
 * - Com formatacao (richText): editor TipTap.
 * Salva no onBlur.
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
  const isMobile = useIsMobile();
  const isRich = richText !== undefined ? richText : multiline;

  const Tag = as;

  if (!editable) {
    if (!isRich) {
      return <Tag className={className}>{value || placeholder}</Tag>;
    }
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(value || placeholder || '') }}
      />
    );
  }

  if (isRich) {
    return (
      <TiptapText
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        multiline={multiline}
        aria-label={ariaLabel}
      />
    );
  }

  // Sincroniza com a prop externa quando nao esta editando.
  useEffect(() => {
    if (ref.current && !isEditing && ref.current.innerText !== value) {
      ref.current.innerText = value || placeholder || '';
    }
  }, [value, isEditing, placeholder]);

  const commit = () => {
    setIsEditing(false);
    const raw = ref.current?.innerText || '';
    const next = sanitizeHtml(raw, true);
    if (next !== value) onChange?.(next);
  };

  const handleBlur = (e: React.FocusEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related?.closest('[data-inline-toolbar]')) return;
    commit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ref.current) ref.current.innerText = value || placeholder || '';
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      className={`${className} outline-none`}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={false}
      aria-label={ariaLabel || placeholder || 'Texto editavel'}
      onFocus={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
    >
      {value || placeholder}
    </Tag>
  );
}
