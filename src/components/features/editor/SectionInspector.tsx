'use client';

import { SECTION_REGISTRY } from '@/landing/sections';
import { SectionConfig } from '@/landing/themes/tokens';
import { SiteData, SettingField } from '@/landing/types';
import {
  TextField,
  TextareaField,
  SelectField,
  ColorField,
  ImageField,
  ListField,
} from './fields';

interface SectionInspectorProps {
  section: SectionConfig;
  sectionIndex: number;
  data: SiteData;
  getFieldValue: (data: SiteData, source: string | undefined, override: unknown) => unknown;
  onUpdateSection: (index: number, patch: Partial<SectionConfig>) => void;
  onUpdateOverride: (index: number, key: string, value: unknown) => void;
  onUpdateContent: (source: string, value: unknown) => void;
}

/**
 * Painel contextual da seção selecionada. Gera os campos
 * automaticamente a partir do schema da seção.
 */
export function SectionInspector({
  section,
  sectionIndex,
  data,
  getFieldValue,
  onUpdateSection,
  onUpdateOverride,
  onUpdateContent,
}: SectionInspectorProps) {
  const entry = SECTION_REGISTRY[section.type];
  if (!entry) return <p className="text-sm text-gray-500">Seção desconhecida.</p>;

  const { schema } = entry;

  const renderField = (field: SettingField) => {
    const value = getFieldValue(data, field.source, section.overrides[field.id]);
    const handleChange = (v: unknown) => {
      if (field.source) {
        onUpdateContent(field.source, v);
      } else {
        onUpdateOverride(sectionIndex, field.id, v);
      }
    };

    const props = { field, value, onChange: handleChange };
    switch (field.type) {
      case 'text': return <TextField key={field.id} {...props} />;
      case 'textarea': return <TextareaField key={field.id} {...props} />;
      case 'select': return <SelectField key={field.id} {...props} />;
      case 'color': return <ColorField key={field.id} {...props} />;
      case 'image': return <ImageField key={field.id} {...props} />;
      case 'list': return <ListField key={field.id} field={field} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{schema.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{schema.description}</p>
      </div>

      {/* Visibilidade */}
      <label className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Visível na página</span>
        <input
          type="checkbox"
          checked={section.visible}
          onChange={(e) => onUpdateSection(sectionIndex, { visible: e.target.checked })}
          className="w-5 h-5 rounded border-gray-300"
        />
      </label>

      {/* Variante de layout */}
      {schema.variants.length > 1 && (
        <SelectField
          field={{
            id: 'variant',
            type: 'select',
            label: 'Estilo de layout',
            options: schema.variants.map((v) => ({ value: v.id, label: v.label })),
          }}
          value={section.variant}
          onChange={(v) => onUpdateSection(sectionIndex, { variant: v as string })}
        />
      )}

      <div className="border-t border-gray-200 pt-4 space-y-5">
        {schema.settings.map(renderField)}
      </div>
    </div>
  );
}
