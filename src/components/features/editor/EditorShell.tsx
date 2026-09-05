'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { SiteRenderer } from '@/landing/SiteRenderer';
import { SiteData } from '@/landing/types';
import { TenantThemeData } from '@/landing/themes/tokens';
import { useEditorState } from './hooks/useEditorState';
import { SectionInspector } from './SectionInspector';
import { SectionList } from './SectionList';
import { ThemePanel } from './ThemePanel';

interface EditorShellProps {
  baseData: SiteData;
  initialTheme: TenantThemeData | null;
  initialContentEdits?: Record<string, unknown>;
  onRefreshData: () => void;
}

type SidePanel = 'sections' | 'design';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: 'max-w-6xl w-full',
  tablet: 'w-[768px] max-w-full',
  mobile: 'w-[390px] max-w-full',
};

const DEVICE_FRAME: Record<DeviceMode, string> = {
  desktop: 'rounded-xl',
  tablet: 'rounded-2xl ring-8 ring-gray-800',
  mobile: 'rounded-[2.5rem] ring-[10px] ring-gray-800 my-4',
};

/**
 * Shell do editor visual: toolbar superior, canvas com o
 * SiteRenderer em modo edição e painel lateral contextual.
 */
export function EditorShell({
  baseData,
  initialTheme,
  initialContentEdits,
  onRefreshData,
}: EditorShellProps) {
  const router = useRouter();
  const editor = useEditorState(initialTheme, initialContentEdits);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [panel, setPanel] = useState<SidePanel>('sections');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [feedback, setFeedback] = useState('');

  const previewData = editor.getPreviewData(baseData);
  const selectedSection = selectedIndex !== null ? editor.theme.sections[selectedIndex] : null;

  // ── Autosave do rascunho (debounce 2s após última mudança) ────
  useEffect(() => {
    if (!editor.isDirty) return;
    const timeout = setTimeout(() => {
      editor.saveDraft();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [editor.isDirty, editor.theme, editor.contentEdits]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Atalhos: Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y ───────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      const target = e.target as HTMLElement;
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (e.key.toLowerCase() === 'z' && !e.shiftKey && !inField) {
        e.preventDefault();
        editor.undo();
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || (e.key.toLowerCase() === 'y')) {
        if (!inField) {
          e.preventDefault();
          editor.redo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editor.undo, editor.redo]);

  // ── Aviso ao sair com alterações não publicadas ───────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (editor.isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [editor.isDirty]);

  const handlePublish = async () => {
    const ok = await editor.publish();
    setFeedback(ok ? 'Publicado com sucesso!' : 'Erro ao publicar.');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleBack = () => {
    if (editor.isDirty && !confirm('Há alterações não publicadas. Sair mesmo assim?')) return;
    router.push('/dashboard');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 text-sm">
            ← Dashboard
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Editor de Página</h1>
          {editor.isDirty && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              Alterações não publicadas
            </span>
          )}
          {editor.saving && (
            <span className="text-xs text-gray-500">Salvando rascunho...</span>
          )}
          {feedback && (
            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {feedback}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
            <button
              onClick={editor.undo}
              disabled={!editor.canUndo}
              title="Desfazer (Ctrl+Z)"
              aria-label="Desfazer"
              className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              ↩
            </button>
            <button
              onClick={editor.redo}
              disabled={!editor.canRedo}
              title="Refazer (Ctrl+Shift+Z)"
              aria-label="Refazer"
              className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              ↪
            </button>
          </div>

          {/* Device preview */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1" role="group" aria-label="Modo de visualização">
            {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDevice(mode)}
                aria-pressed={device === mode}
                title={mode === 'desktop' ? 'Desktop' : mode === 'tablet' ? 'Tablet' : 'Celular'}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  device === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {mode === 'desktop' ? '🖥' : mode === 'tablet' ? '▭' : '▯'}
              </button>
            ))}
          </div>

          {editor.lastSavedAt && (
            <span className="text-xs text-gray-400">
              Salvo {editor.lastSavedAt.toLocaleTimeString('pt-BR')}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={editor.saveDraft}
            loading={editor.saving}
            disabled={editor.saving}
          >
            Salvar rascunho
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublish}
            loading={editor.publishing}
            disabled={editor.publishing}
          >
            Publicar
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-4 flex justify-center">
          <div
            className={`bg-white shadow-2xl overflow-hidden transition-all duration-300 self-start ${DEVICE_WIDTHS[device]} ${DEVICE_FRAME[device]}`}
          >
            {/* Notch do celular */}
            {device === 'mobile' && (
              <div className="bg-gray-800 flex justify-center py-2">
                <div className="w-24 h-5 bg-gray-900 rounded-full" />
              </div>
            )}
            <SiteRenderer
              data={previewData}
              theme={editor.theme}
              editable
              selectedIndex={selectedIndex}
              onSelectSection={(i) => {
                setSelectedIndex(i);
                setPanel('sections');
              }}
            />
          </div>
        </div>

        {/* Painel lateral */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="flex border-b border-gray-200" role="tablist">
            <button
              role="tab"
              aria-selected={panel === 'sections'}
              onClick={() => setPanel('sections')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                panel === 'sections'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Seções
            </button>
            <button
              role="tab"
              aria-selected={panel === 'design'}
              onClick={() => setPanel('design')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                panel === 'design'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Design
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {panel === 'design' ? (
              <ThemePanel
                theme={editor.theme}
                onUpdateColors={editor.updateColors}
                onUpdateTokens={editor.updateTokens}
                onApplyTemplate={editor.applyTemplate}
              />
            ) : selectedSection ? (
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
                  editor.removeSection(i);
                  if (selectedIndex === i) setSelectedIndex(null);
                }}
                onToggleVisible={(i, visible) =>
                  editor.updateSection(i, { visible })
                }
                onAdd={editor.addSection}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
