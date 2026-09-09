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
 * Componente de texto editável inline.
 * Quando `editable=true`, o usuário pode clicar e editar o texto
 * diretamente no preview. Salva no `onBlur`.
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

  // Sincroniza com a prop externa quando não está editando.
  // Evita sobrescrever enquanto o usuário digita.
  useEffect(() => {
    if (ref.current && !isEditing && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, isEditing]);

  const Tag = as;

  if (!editable) {
    return (
      <Tag className={className}>
        {value || placeholder}
      </Tag>
    ) as React.ReactNode;
  }

  const handleBlur = () => {
    setIsEditing(false);
    const next = ref.current?.textContent || '';
    if (next !== value) onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ref.current) ref.current.textContent = value;
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      className={className}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {value || placeholder}
    </Tag>
  ) as React.ReactNode;
}
