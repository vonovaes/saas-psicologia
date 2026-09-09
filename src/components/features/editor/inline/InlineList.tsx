'use client';

import { useEffect, useRef } from 'react';
import { InlineText } from './InlineText';
import { Plus, X } from 'lucide-react';

interface InlineListProps {
  items: string[];
  onChange: (items: string[]) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  itemClassName?: string;
  addLabel?: string;
}

/**
 * Lista editavel de chips/textos (especialidades, abordagens etc).
 * Cada item eh editavel inline e pode ser removido.
 * O botao `+` adiciona um novo item vazio no final e foca nele.
 */
export function InlineList({
  items,
  onChange,
  editable,
  placeholder,
  className,
  itemClassName,
  addLabel = '+ Adicionar',
}: InlineListProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previousLength = useRef(items.length);

  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  const add = () => {
    previousLength.current = items.length;
    onChange([...items, '']);
  };

  useEffect(() => {
    if (editable && items.length > previousLength.current) {
      const target = rootRef.current?.querySelector(
        '[data-inline-list-item]:last-child [contenteditable="true"]'
      ) as HTMLElement | null;
      target?.focus();
    }
    previousLength.current = items.length;
  }, [items.length, editable, items]);

  if (!editable) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <span
            key={index}
            className={itemClassName}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={className}>
      {items.map((item, index) => (
        <span
          key={index}
          data-inline-list-item
          className={`relative group ${itemClassName || ''}`}
        >
          <InlineText
            as="span"
            value={item}
            editable={editable}
            onChange={(v) => update(index, v)}
            placeholder={placeholder}
            aria-label={placeholder || 'Item da lista'}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(index);
            }}
            className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-site-text-muted opacity-60 hover:bg-red-100 hover:text-red-600 hover:opacity-100"
            aria-label="Remover"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          add();
        }}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-site-primary/40 px-3 py-1.5 text-sm text-site-primary/80 transition-colors hover:border-site-primary hover:text-site-primary"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
