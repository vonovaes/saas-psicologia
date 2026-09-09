'use client';

import { useEffect, useRef } from 'react';
import { X, LayoutTemplate } from 'lucide-react';
import { SectionList } from './SectionList';
import { SectionInspector } from './SectionInspector';
import { SiteData } from '@/landing/types';
import { TenantThemeData } from '@/landing/themes/tokens';
import { useEditorState } from './hooks/useEditorState';

interface SectionsPanelProps {
  open: boolean;
  onClose: () => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  editor: ReturnType<typeof useEditorState>;
  baseData: SiteData;
  onRefreshData: () => void;
}

export function SectionsPanel({
  open,
  onClose,
  selectedIndex,
  setSelectedIndex,
  editor,
  baseData,
  onRefreshData,
}: SectionsPanelProps) {
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

  const selectedSection = selectedIndex !== null ? editor.theme.sections[selectedIndex] : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="sections-dialog fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 lg:ml-auto lg:w-[28rem]"
      aria-label="Gerenciar seções"
    >
      <div className="flex h-full w-full flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-acolha-line px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 text-acolha-ink">
            <LayoutTemplate className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {selectedSection ? 'Editar seção' : 'Seções'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {selectedSection && (
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="text-sm font-medium text-acolha-ink transition-colors hover:text-acolha-muted"
              >
                ← Voltar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-acolha-line text-acolha-ink transition-colors hover:bg-acolha-mist"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {selectedSection ? (
            <SectionInspector
              section={selectedSection}
              sectionIndex={selectedIndex!}
              data={baseData}
              getFieldValue={editor.getFieldValue}
              onUpdateSection={editor.updateSection}
              onUpdateOverride={editor.updateSectionOverride}
              onUpdateContent={editor.updateContent}
              onRefreshData={onRefreshData}
              onBack={() => setSelectedIndex(null)}
            />
          ) : (
            <SectionList
              sections={editor.theme.sections}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onMove={editor.moveSection}
              onRemove={(i) => {
                if (window.confirm('Tem certeza que deseja remover esta seção?')) {
                  editor.removeSection(i);
                  if (selectedIndex === i) setSelectedIndex(null);
                }
              }}
              onToggleVisible={(i, visible) => editor.updateSection(i, { visible })}
              onAdd={editor.addSection}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
