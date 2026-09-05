'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { TEMPLATES, TemplateMeta } from '@/landing/themes/presets';

interface TemplateGalleryProps {
  currentTemplateId?: string;
}

/**
 * Galeria de templates. Cada card mostra um mini-mockup
 * renderizado com as cores reais do preset.
 */
export function TemplateGallery({ currentTemplateId }: TemplateGalleryProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  const applyTemplate = async (template: TemplateMeta) => {
    setApplying(true);
    setError('');

    try {
      const response = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          theme: template.preset,
        }),
      });

      if (!response.ok) throw new Error('Failed to apply template');

      router.push('/profile');
    } catch (err) {
      console.error('Error applying template:', err);
      setError('Erro ao aplicar template. Tente novamente.');
      setApplying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TEMPLATES.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isActive={currentTemplateId === template.id}
          isSelected={selected === template.id}
          applying={applying && selected === template.id}
          onSelect={() => setSelected(template.id)}
          onApply={() => applyTemplate(template)}
        />
      ))}
      {error && (
        <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateMeta;
  isActive: boolean;
  isSelected: boolean;
  applying: boolean;
  onSelect: () => void;
  onApply: () => void;
}

function TemplateCard({ template, isActive, isSelected, applying, onSelect, onApply }: TemplateCardProps) {
  const { swatch } = template;

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-white ${
        isSelected
          ? 'border-blue-500 shadow-xl scale-[1.02]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {/* Mini preview do site */}
      <div
        className="h-48 p-6 flex flex-col justify-between"
        style={{ backgroundColor: swatch.bg }}
      >
        <div>
          <div
            className="w-8 h-1 rounded-full mb-3"
            style={{ backgroundColor: swatch.primary }}
          />
          <div
            className="text-xl font-light mb-1"
            style={{ color: swatch.text }}
          >
            Dra. Exemplo
          </div>
          <div
            className="text-xs"
            style={{ color: swatch.text, opacity: 0.6 }}
          >
            {template.mood}
          </div>
        </div>
        <div className="flex gap-2">
          <div
            className="px-3 py-1 rounded-full text-[10px] font-medium"
            style={{ backgroundColor: swatch.primary, color: swatch.bg }}
          >
            Agendar
          </div>
          <div
            className="px-3 py-1 rounded-full text-[10px]"
            style={{ border: `1px solid ${swatch.primary}40`, color: swatch.primary }}
          >
            Especialidade
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          {isActive && (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              Ativo
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
          variant={isSelected ? 'primary' : 'outline'}
          size="sm"
          loading={applying}
          disabled={applying || isActive}
          className="w-full"
        >
          {applying ? 'Aplicando...' : isActive ? 'Template Ativo' : 'Usar este template'}
        </Button>
      </div>
    </div>
  );
}
