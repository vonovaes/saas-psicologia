'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { KnowAcolhaCta } from '@/components/features/marketing/KnowAcolhaCta';
import { MarketingButton } from '@/components/features/marketing/ui/button';

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-[#fcfcfa]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <a href="#conteudo" className="text-2xl font-semibold tracking-tight text-acolha-ink">
          Acolha<span className="text-acolha-accent">.</span>
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
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="mobile-menu fixed inset-0 m-0 h-dvh w-full max-h-none max-w-none border-0 bg-transparent p-0"
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        onClose={() => setOpen(false)}
      >
        <div
          className={`flex h-full w-full flex-col bg-[#fcfcfa] px-6 py-5 shadow-2xl transition-transform duration-200 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: '#fcfcfa' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold tracking-tight text-acolha-ink">
              Acolha<span className="text-acolha-accent">.</span>
            </span>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-acolha-line text-acolha-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acolha-accent"
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
                className="rounded-xl px-3 py-3 text-base text-acolha-ink transition-colors hover:bg-acolha-mist"
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
      </dialog>
    </header>
  );
}
