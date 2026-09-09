'use client';

import { useEffect } from 'react';
import { X, Palette } from 'lucide-react';
import { ThemePanel } from './ThemePanel';
import { TenantThemeData, ThemeTokens } from '@/landing/themes/tokens';

interface PersonalizePanelProps {
  open: boolean;
  onClose: () => void;
  theme: TenantThemeData;
  onUpdateColors: (colors: Partial<ThemeTokens['colors']>) => void;
  onUpdateTokens: (tokens: Partial<ThemeTokens>) => void;
  onApplyTemplate: (template: TenantThemeData) => void;
}

export function PersonalizePanel({
  open,
  onClose,
  theme,
  onUpdateColors,
  onUpdateTokens,
  onApplyTemplate,
}: PersonalizePanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 bg-acolha-ink/40"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
        aria-label="Fechar painel"
      />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full flex-col bg-white shadow-2xl sm:w-[28rem]">
        <div className="flex items-center justify-between border-b border-acolha-line px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 text-acolha-ink">
            <Palette className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Personalizar</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-acolha-line text-acolha-ink transition-colors hover:bg-acolha-mist"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ThemePanel
            theme={theme}
            onUpdateColors={onUpdateColors}
            onUpdateTokens={onUpdateTokens}
            onApplyTemplate={onApplyTemplate}
          />
        </div>
      </div>
    </div>
  );
}
