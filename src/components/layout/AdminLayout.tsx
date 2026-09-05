'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
  userEmail?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '7xl';
}

const MAX_WIDTHS = {
  md: 'max-w-md',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export function AdminLayout({
  title,
  subtitle,
  breadcrumb,
  actions,
  userEmail,
  children,
  maxWidth = '7xl',
}: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Usa a origem atual do navegador — não pode depender de NEXTAUTH_URL,
    // que pode apontar para localhost em produção se a env não estiver configurada.
    await signOut({ callbackUrl: `${window.location.origin}/` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Painel Administrativo
          </button>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-gray-700 hidden sm:inline">{userEmail}</span>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </button>
            <Button onClick={handleLogout} variant="danger" size="sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className={`${MAX_WIDTHS[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </button>
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                {item.href ? (
                  <button
                    onClick={() => router.push(item.href!)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-gray-900">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      )}

      {/* Page Title */}
      <main className={`${MAX_WIDTHS[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}
