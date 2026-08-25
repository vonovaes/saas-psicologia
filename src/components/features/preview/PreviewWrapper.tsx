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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${showPreview ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {showPreview ? 'Preview Ativo' : 'Preview Oculto'}
            </span>
          </div>
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
        <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'} border-r border-gray-200 overflow-y-auto bg-white`}>
          <div className="p-6 max-w-3xl mx-auto">
            {children}
          </div>
        </div>

        {/* Preview Section - Desktop */}
        {showPreview && (
          <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Preview da Landing Page</p>
                    <div className="w-20" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">As alterações aparecem automaticamente (debounce: 300ms)</p>
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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Preview da Landing Page</h2>
              </div>
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
