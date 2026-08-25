'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui';

interface PreviewWrapperProps {
  children: ReactNode;
  preview: ReactNode;
  title?: string;
}

export function PreviewWrapper({ children, preview, title = 'Preview ao Vivo' }: PreviewWrapperProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline">
            {showPreview ? 'Preview Ativo' : 'Preview Oculto'}
          </span>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant={showPreview ? 'primary' : 'outline'}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
          </Button>
          <Button
            onClick={() => setIsMobilePreviewOpen(true)}
            variant="primary"
            size="sm"
            className="sm:hidden"
          >
            Ver Preview
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
        {/* Form Section */}
        <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'} border-r border-gray-200 overflow-y-auto`}>
          <div className="p-6">
            {children}
          </div>
        </div>

        {/* Preview Section - Desktop */}
        {showPreview && (
          <div className="hidden lg:block lg:w-1/2 bg-gray-100 overflow-y-auto">
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Preview da Landing Page</p>
                  <p className="text-xs text-gray-500">As alterações aparecem automaticamente</p>
                </div>
                <div className="h-[calc(100vh-200px)] overflow-y-auto">
                  {preview}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Preview Modal */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 sm:hidden">
          <div className="fixed inset-0 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Preview da Landing Page</h2>
              <Button
                onClick={() => setIsMobilePreviewOpen(false)}
                variant="outline"
                size="sm"
              >
                Fechar
              </Button>
            </div>
            <div className="p-4">
              {preview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
