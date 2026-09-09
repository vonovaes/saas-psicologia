'use client';

import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface InlineImageProps {
  src: string | null;
  onChange: (url: string | null) => void;
  editable?: boolean;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  children?: React.ReactNode;
}

/**
 * Imagem editavel inline. Clica para trocar ou remover.
 * Ocupa 100% do container pai para garantir touch em toda a area.
 */
export function InlineImage({
  src,
  onChange,
  editable,
  alt,
  className,
  placeholderClassName,
  children,
}: InlineImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Fecha em clique fora e ao pressionar Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  useEffect(() => {
    if (open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const popoverHeight = 140;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow >= popoverHeight + 8
          ? rect.bottom + window.scrollY + 8
          : rect.top + window.scrollY - popoverHeight - 8;
      setPos({
        top,
        left: rect.left + window.scrollX + rect.width / 2 - 112,
      });
    }
  }, [open]);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed: ${response.status}`);
      }
      const data = await response.json();
      const url = data?.file?.url;
      if (!url) {
        throw new Error('Resposta do servidor nao contem a URL da imagem.');
      }
      onChange(url);
      setOpen(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Erro ao enviar. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setOpen(false);
  };

  if (!editable) {
    return src ? (
      <div
        ref={rootRef}
        className={`${className} bg-cover bg-center`}
        role="img"
        aria-label={alt}
        style={{ backgroundImage: `url(${src})` }}
      />
    ) : (
      <div ref={rootRef} className={placeholderClassName}>{children}</div>
    );
  }

  return (
    <div ref={rootRef} className="relative h-full w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="h-full w-full"
        aria-label={src ? `Trocar imagem: ${alt}` : `Adicionar imagem: ${alt}`}
      >
        {src ? (
          <div
            className={`${className} h-full w-full bg-cover bg-center`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ) : (
          <div className={`${placeholderClassName} h-full w-full`}>{children}</div>
        )}
      </button>

      {open && pos && (
        <div
          className="fixed z-[100] w-56 overflow-hidden rounded-2xl border border-acolha-line bg-white p-2 shadow-2xl"
          style={{
            top: pos.top,
            left: Math.max(8, Math.min(window.innerWidth - 240, pos.left)),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <label className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-acolha-ink transition-colors hover:bg-acolha-mist">
            <Pencil className="h-4 w-4 text-acolha-muted" />
            {uploading ? 'Enviando...' : 'Trocar imagem'}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>

          {src && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </button>
          )}

          {error && (
            <p className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
