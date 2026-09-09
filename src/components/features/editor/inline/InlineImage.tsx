'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

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
 * Imagem editavel inline. Clique abre um pequeno popover
 * para trocar (upload) ou remover a imagem.
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
  const isMobile = useIsMobile();

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
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
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
      onChange(data.url);
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
        role="img"
        aria-label={alt}
        className={className}
        style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
    ) : (
      <div className={placeholderClassName}>{children}</div>
    );
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="block w-full"
        aria-label={src ? `Trocar imagem: ${alt}` : `Adicionar imagem: ${alt}`}
      >
        {src ? (
          <div
            className={className}
            style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ) : (
          <div className={placeholderClassName}>{children}</div>
        )}
      </button>

      {open && (
        <div
          className={`z-50 flex flex-col gap-2 rounded-xl border border-acolha-line bg-white p-2 shadow-2xl ${
            isMobile
              ? 'fixed bottom-4 left-1/2 w-56 -translate-x-1/2'
              : 'absolute mt-2'
          }`}
        >
          <label className="cursor-pointer rounded-lg px-4 py-2 text-left text-sm text-acolha-ink transition-colors hover:bg-acolha-mist">
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
              className="rounded-lg px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              Remover
            </button>
          )}
          {error && (
            <p className="px-4 py-2 text-xs text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
