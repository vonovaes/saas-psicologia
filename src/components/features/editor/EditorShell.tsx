'use client';

import { useState } from 'react';
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
  onRefreshData: () => void;
}

type SidePanel = 'sections' | 'design';

/**
 * Shell do editor visual: toolbar superior, canvas com o
 * SiteRenderer em modo edição e painel lateral contextual.
 */
export function EditorShell({ baseData, initialTheme, onRefreshData }: EditorShellProps) {
  const router = useRouter();
  const editor = useEditorState(initialTheme);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [panel, setPanel] = useState<SidePanel>('sections');
  const [feedback, setFeedback] = useState('');

  const previewData = editor.getPreviewData(baseData);
  const selectedSection = selectedIndex !== null ? editor.theme.sections[selectedIndex] : null;

  const handlePublish = async () => {
    const ok = await editor.publish();
    setFeedback(ok ? 'Publicado com sucesso!' : 'Erro ao publicar.');
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Editor de Página</h1>
          {editor.isDirty && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              Alterações não publicadas
            </span>
          )}
          {feedback && (
            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {feedback}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
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
        <div className="flex-1 overflow-y-auto bg-gray-200 p-4">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
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
          <div className="flex border-b border-gray-200">
            <button
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
