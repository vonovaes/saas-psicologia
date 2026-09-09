'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface TiptapTextProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  'aria-label'?: string;
}

/**
 * Editor de texto inline com TipTap.
 * Substitui o uso de document.execCommand.
 */
export function TiptapText({
  value,
  onChange,
  className,
  placeholder,
  multiline,
  'aria-label': ariaLabel,
}: TiptapTextProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: multiline ? undefined : false,
        paragraph: { HTMLAttributes: { class: className } },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '<p></p>',
    editable: true,
    immediatelyRender: false,
    onFocus: () => setShowToolbar(true),
    onBlur: () => {
      setShowToolbar(false);
      if (!editor) return;
      const next = sanitizeHtml(editor.getHTML());
      if (next !== value) onChange?.(next);
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused && editor.getHTML() !== value) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
    }
  }, [value, editor]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      editor?.commands.setContent(value || '<p></p>');
      (e.target as HTMLElement).blur();
    }
  };

  if (!editor) return <div className={className}>{value || placeholder}</div>;

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className={`prose max-w-none outline-none ${className}`}
        role="textbox"
        aria-multiline={multiline}
        aria-label={ariaLabel || placeholder || 'Texto editavel'}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      />
      {showToolbar && (
        <div
          className="fixed z-[100] flex items-center gap-1 rounded-full border border-acolha-line bg-white px-3 py-2 shadow-lg"
          style={{ bottom: 16, left: Math.max(8, Math.min(window.innerWidth - 240, window.innerWidth / 2 - 120)) }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="Negrito"
          >
            B
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="Italico"
          >
            I
          </ToolbarButton>
          <div className="mx-1 h-4 w-px bg-acolha-line" />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            label="Alinhar esquerda"
          >
            ←
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            label="Centralizar"
          >
            ↔
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            label="Alinhar direita"
          >
            →
          </ToolbarButton>
        </div>
      )}
    </div>
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
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
        active ? 'bg-acolha-accent text-white' : 'text-acolha-ink hover:bg-acolha-mist'
      }`}
    >
      {children}
    </button>
  );
}
