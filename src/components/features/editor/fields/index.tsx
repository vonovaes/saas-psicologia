'use client';

import { useState } from 'react';
import { Input, Textarea } from '@/components/ui';
import { SettingField } from '@/landing/types';

interface FieldProps {
  field: SettingField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function TextField({ field, value, onChange }: FieldProps) {
  return (
    <Input
      label={field.label}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextareaField({ field, value, onChange }: FieldProps) {
  return (
    <Textarea
      label={field.label}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
    />
  );
}

export function SelectField({ field, value, onChange }: FieldProps) {
  const options = field.options ?? [];
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      <select
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ColorField({ field, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={(value as string) ?? '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function ImageField({ field, value, onChange }: FieldProps) {
  const [uploading, setUploading] = useState(false);
  const current = (value as string) ?? '';

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
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      {current && (
        <div
          className="w-full h-32 rounded-lg bg-cover bg-center mb-2 border border-gray-200"
          style={{ backgroundImage: `url(${current})` }}
        />
      )}
      <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors text-sm text-gray-600">
        {uploading ? 'Enviando...' : current ? 'Trocar imagem' : 'Enviar imagem'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
    </div>
  );
}

/** ListField: edição de listas chega na fase E4; por ora, direciona à página dedicada. */
export function ListField({ field }: { field: SettingField }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <p className="text-sm font-medium text-gray-700 mb-1">{field.label}</p>
      <p className="text-xs text-gray-500">
        A edição de listas no editor chega na próxima etapa. Por enquanto, gerencie em{' '}
        {field.source === 'faqs' ? 'Gestão de FAQ' : 'Editar Perfil'}.
      </p>
    </div>
  );
}
