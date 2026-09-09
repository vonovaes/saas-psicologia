'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Pencil, Trash2, X } from 'lucide-react';

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
 * Imagem editavel inline. Clique abre um pequeno menu proximo a imagem
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
          className={`z-50 w-56 rounded-2xl border border-acolha-line bg-white p-2 shadow-2xl ${
            isMobile
              ? 'absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2'
              : 'absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2'
          }`}
        >
          <div className="mb-2 flex items-center justify-between px-2 pt-1">
            <span className="text-xs font-medium text-acolha-ink">Foto do perfil</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-acolha-muted hover:text-acolha-ink"
              aria-label="Fechar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

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
