'use client';

import { useState } from 'react';

/**
 * Botão de copiar com feedback visual. Cliente porque usa clipboard.
 */
export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={className}
    >
      {copied ? '✓ Copiado!' : 'Copiar'}
    </button>
  );
}
