'use client';

import { useRef, useState } from 'react';
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
 * Imagem editável inline. Clique abre um pequeno popover
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
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isMobile = useIsMobile();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setOpen(false);
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
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
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
        >          <label className="cursor-pointer rounded-lg px-4 py-2 text-left text-sm text-acolha-ink transition-colors hover:bg-acolha-mist">
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
        </div>
      )}
    </div>
  );
}
