'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { TemplateGallery } from '@/components/features/editor/TemplateGallery';
import { useTheme } from '@/hooks/useApi';

export default function EditorPage() {
  const { theme, loading } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <AdminLayout
      title="Editor de Página"
      subtitle="Escolha um template e personalize sua landing page"
      breadcrumb={[{ label: 'Editor de Página' }]}
    >
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Escolha um template:</strong> cada opção já vem com cores, fontes e layout
          definidos. Depois você poderá personalizar seções, fotos e textos.
        </p>
      </div>

      <TemplateGallery currentTemplateId={theme?.templateId} />
    </AdminLayout>
  );
}
