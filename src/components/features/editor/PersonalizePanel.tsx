'use client';

import { useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="personalize-dialog fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 lg:ml-auto lg:w-[28rem]"
      aria-label="Personalizar design"
    >
      <div className="flex h-full w-full flex-col bg-white shadow-2xl">
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
    </dialog>
  );
}
