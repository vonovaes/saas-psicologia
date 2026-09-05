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

// ─── Listas ─────────────────────────────────────────────────────

/** Editor de lista de strings (ex: especialidades) com chips. */
export function StringListField({ field, value, onChange }: FieldProps) {
  const [input, setInput] = useState('');
  const items = (value as string[]) ?? [];

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
          >
            {item}
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Adicionar item"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button
          onClick={add}
          className="px-3 py-2 bg-gray-900 text-white text-sm rounded-md shrink-0"
        >
          +
        </button>
      </div>
    </div>
  );
}

interface ObjectListItem {
  [key: string]: string;
}

/** Editor de lista de objetos (ex: depoimentos {name, text}). */
export function ObjectListField({ field, value, onChange }: FieldProps) {
  const items = (value as ObjectListItem[]) ?? [];
  const subFields = field.listFields ?? [];

  const update = (index: number, key: string, v: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: v } : item));
    onChange(next);
  };

  const add = () => {
    const empty = Object.fromEntries(subFields.map((f) => [f.key, '']));
    onChange([...items, empty]);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{field.label}</label>
        <button onClick={add} className="text-xs text-blue-600 hover:text-blue-800">
          + Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Item {index + 1}</span>
              <button
                onClick={() => remove(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remover
              </button>
            </div>
            {subFields.map((sf) => (
              <div key={sf.key}>
                <Input
                  label={sf.label}
                  value={item[sf.key] ?? ''}
                  onChange={(e) => update(index, sf.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">
            Nenhum item. Clique em "+ Adicionar".
          </p>
        )}
      </div>
    </div>
  );
}

interface FaqListItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Editor de FAQ com persistência imediata via /api/faq
 * (mesmo comportamento da página Gestão de FAQ).
 */
export function FaqListField({
  faqs,
  onRefresh,
}: {
  faqs: FaqListItem[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const call = async (method: string, body?: object, query?: string) => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/faq${query ?? ''}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      setError('Erro ao salvar FAQ');
    } finally {
      setBusy(false);
    }
  };

  const updateItem = (faq: FaqListItem) =>
    call('PUT', { id: faq.id, question: faq.question, answer: faq.answer });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Perguntas Frequentes</label>
        <button
          disabled={busy}
          onClick={() =>
            call('POST', { question: 'Nova pergunta', answer: 'Nova resposta' })
          }
          className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          + Adicionar
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">FAQ</span>
              <button
                disabled={busy}
                onClick={() => call('DELETE', undefined, `?id=${faq.id}`)}
                className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                Remover
              </button>
            </div>
            <Input
              label="Pergunta"
              defaultValue={faq.question}
              onBlur={(e) =>
                e.target.value !== faq.question &&
                updateItem({ ...faq, question: e.target.value })
              }
            />
            <Textarea
              label="Resposta"
              defaultValue={faq.answer}
              rows={2}
              onBlur={(e) =>
                e.target.value !== faq.answer &&
                updateItem({ ...faq, answer: e.target.value })
              }
            />
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">
            Nenhuma FAQ. Clique em "+ Adicionar".
          </p>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        FAQs são salvas imediatamente (entidade própria).
      </p>
    </div>
  );
}

