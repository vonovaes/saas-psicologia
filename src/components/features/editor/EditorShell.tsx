'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { SiteRenderer } from '@/landing/SiteRenderer';
import { SiteData } from '@/landing/types';
import { TenantThemeData } from '@/landing/themes/tokens';
import { useEditorState } from './hooks/useEditorState';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionsPanel } from './SectionsPanel';
import { PersonalizePanel } from './PersonalizePanel';

interface EditorShellProps {
  baseData: SiteData;
  initialTheme: TenantThemeData | null;
  initialContentEdits?: Record<string, unknown>;
  publicSlug?: string | null;
  onRefreshData: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: 'w-full lg:max-w-6xl',
  tablet: 'w-full lg:w-[768px] lg:max-w-full',
  mobile: 'w-full lg:w-[390px] lg:max-w-full',
};

const DEVICE_FRAME: Record<DeviceMode, string> = {
  desktop: 'rounded-xl',
  tablet: 'rounded-xl lg:rounded-2xl lg:ring-8 lg:ring-gray-800',
  mobile: 'rounded-xl lg:rounded-[2.5rem] lg:ring-[10px] lg:ring-gray-800 lg:my-4',
};

/**
 * Shell do editor visual: toolbar superior, canvas com o
 * SiteRenderer em modo edicao e paineis flutuantes para
 * secoes e personalizacao.
 */
export function EditorShell({
  baseData,
  initialTheme,
  initialContentEdits,
  publicSlug,
  onRefreshData,
}: EditorShellProps) {
  const router = useRouter();
  const editor = useEditorState(initialTheme, initialContentEdits);
  const isMobile = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [feedback, setFeedback] = useState('');
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  const previewData = editor.getPreviewData(baseData);

  // No mobile real, o preview ocupa a tela toda como se fosse o dispositivo.
  useEffect(() => {
    setDevice(isMobile ? 'mobile' : 'desktop');
  }, [isMobile]);

  useEffect(() => {
    if (!editor.isDirty) return;
    const timeout = setTimeout(() => {
      editor.saveDraft();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [editor.isDirty, editor.theme, editor.contentEdits]);

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

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (editor.isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [editor.isDirty]);

  const handlePublish = async () => {
    const ok = await editor.publish();
    if (ok) {
      setFeedback('Publicado com sucesso!');
      onRefreshData();
    } else {
      setFeedback('Erro ao publicar.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleBack = () => {
    if (editor.isDirty && !confirm('Há alterações não publicadas. Sair mesmo assim?')) return;
    router.push('/dashboard');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 shrink-0 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 text-sm whitespace-nowrap">
            ← <span className="hidden sm:inline">Dashboard</span>
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Editor de Página</h1>
          {editor.isDirty && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full hidden sm:inline">
              Não publicado
            </span>
          )}
          {editor.saving && (
            <span className="text-xs text-gray-500 hidden sm:inline">Salvando...</span>
          )}
          {feedback && (
            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {feedback}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2 sm:pr-3">
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
          <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1" role="group" aria-label="Modo de visualizacao">
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
            <span className="text-xs text-gray-400 hidden xl:inline">
              Salvo {editor.lastSavedAt.toLocaleTimeString('pt-BR')}
            </span>
          )}
          <button
            type="button"
            onClick={() => setSectionsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-3 sm:text-sm"
          >
            ☰ <span className="hidden sm:inline">Seções</span>
          </button>
          <button
            type="button"
            onClick={() => setPersonalizeOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-3 sm:text-sm"
          >
            🎨 <span className="hidden sm:inline">Personalizar</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={editor.saveDraft}
            loading={editor.saving}
            disabled={editor.saving}
            className="hidden sm:inline-flex"
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
          {publicSlug && (
            <a
              href={`/p/${publicSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
              title="Abrir página pública"
            >
              Ver página ↗
            </a>
          )}
        </div>
      </header>

      {/* Canvas */}
      <div className={`relative flex-1 overflow-y-auto bg-gray-200 ${isMobile ? '' : 'p-2 sm:p-4 flex justify-center'}`}>
        <div
          className={`${
            isMobile
              ? 'w-full'
              : 'bg-white shadow-2xl overflow-hidden transition-all duration-300 self-start ' + DEVICE_WIDTHS[device] + ' ' + DEVICE_FRAME[device]
          }`}
        >
          {!isMobile && device === 'mobile' && (
            <div className="hidden lg:flex bg-gray-800 justify-center py-2">
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
              setSectionsOpen(true);
            }}
            onUpdateContent={editor.updateContent}
            onUpdateSectionOverride={editor.updateSectionOverride}
            onMoveSection={editor.moveSection}
            onUpdateSection={editor.updateSection}
            onRemoveSection={(i) => {
              if (!window.confirm('Tem certeza que deseja remover esta seção?')) return;
              editor.removeSection(i);
              if (selectedIndex === i) setSelectedIndex(null);
            }}
            onReorderSections={editor.reorderSections}
          />
        </div>
      </div>

      <SectionsPanel
        open={sectionsOpen}
        onClose={() => setSectionsOpen(false)}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        editor={editor}
        baseData={baseData}
        onRefreshData={onRefreshData}
      />

      <PersonalizePanel
        open={personalizeOpen}
        onClose={() => setPersonalizeOpen(false)}
        theme={editor.theme}
        onUpdateColors={editor.updateColors}
        onUpdateTokens={editor.updateTokens}
        onApplyTemplate={editor.applyTemplate}
      />
    </div>
  );
}
