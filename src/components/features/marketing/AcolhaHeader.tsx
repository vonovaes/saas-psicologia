'use client';

import { useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { KnowAcolhaCta } from '@/components/features/marketing/KnowAcolhaCta';
import { MarketingButton } from '@/components/features/marketing/ui/button';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '#problema', label: 'O problema' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#para-quem', label: 'Para quem é' },
  { href: '#perguntas', label: 'Perguntas' },
];

type AcolhaHeaderProps = {
  loginHref: string;
  salesContactUrl: string | null;
};

export function AcolhaHeader({ loginHref, salesContactUrl }: AcolhaHeaderProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-[#fcfcfa]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <a href="#conteudo" className="text-2xl font-semibold tracking-tight text-acolha-ink">
          acolha<span className="text-acolha-accent">.</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-acolha-muted md:flex" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-acolha-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <MarketingButton href={loginHref} variant="secondary" size="sm">
            Entrar
          </MarketingButton>
          <KnowAcolhaCta salesContactUrl={salesContactUrl} size="sm" />
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-acolha-line text-acolha-ink transition-colors hover:border-acolha-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acolha-accent md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>

      <div
        className={cn('fixed inset-0 z-50 md:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}
        inert={!open ? true : undefined}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          className={cn(
            'absolute inset-0 bg-acolha-ink/25 transition-opacity duration-200',
            open ? 'opacity-100' : 'opacity-0',
          )}
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            'absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-[#fcfcfa] px-6 py-5 shadow-xl transition-transform duration-200 ease-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">acolha.</span>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-acolha-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acolha-accent"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Fechar menu</span>
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-2" aria-label="Navegação mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base text-acolha-ink hover:bg-acolha-mist"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pb-6">
            <MarketingButton href={loginHref} variant="secondary" onClick={() => setOpen(false)}>
              Entrar
            </MarketingButton>
            <KnowAcolhaCta salesContactUrl={salesContactUrl} onClick={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
