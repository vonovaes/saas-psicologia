'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

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
    <div className="min-h-screen bg-acolha-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-acolha-line/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-baseline gap-2 transition-opacity hover:opacity-70"
          >
            <span className="text-xl font-semibold tracking-tight text-acolha-ink">
              Acolha
              <span className="text-acolha-accent">.</span>
            </span>
            <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider text-acolha-muted">
              Painel
            </span>
          </button>
          <nav className="flex items-center gap-2 sm:gap-4">
            {userEmail && (
              <span className="hidden md:inline max-w-[180px] truncate text-sm text-acolha-muted">
                {userEmail}
              </span>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-acolha-body transition-colors hover:bg-acolha-mist hover:text-acolha-ink"
            >
              Início
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-acolha-line px-3.5 py-1.5 text-sm font-medium text-acolha-body transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className={`${MAX_WIDTHS[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 pt-5`}>
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-acolha-muted hover:text-acolha-ink"
            >
              Início
            </button>
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center space-x-2">
                <span className="text-acolha-line">/</span>
                {item.href ? (
                  <button
                    onClick={() => router.push(item.href!)}
                    className="text-acolha-muted hover:text-acolha-ink"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-acolha-ink">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      )}

      {/* Page Title */}
      <main className={`${MAX_WIDTHS[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="mb-8 flex flex-wrap justify-between items-start gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-acolha-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-1.5 text-acolha-body">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}
