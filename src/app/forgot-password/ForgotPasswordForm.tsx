'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingButton } from '@/components/features/marketing/ui/button';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? 'Erro ao enviar. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-acolha-line bg-white px-4 py-3 text-sm text-acolha-ink placeholder:text-acolha-muted/60 focus:border-acolha-accent focus:outline-none focus:ring-2 focus:ring-acolha-accent/20 transition-colors';
  const labelClass = 'block text-sm font-medium text-acolha-ink mb-1.5';

  return (
    <div className="min-h-screen bg-acolha-bg flex flex-col">
      <header className="px-6 py-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight text-acolha-ink">
            Acolha
            <span className="text-acolha-accent">.</span>
          </Link>
          <MarketingButton href="/login" variant="ghost" size="sm">
            Entrar
          </MarketingButton>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-medium tracking-tight text-acolha-ink">
              Recuperar senha
            </h1>
            <p className="mt-3 text-acolha-body">
              Informe seu email para receber o link de redefinição.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_80px_-35px_rgba(24,49,43,0.25)] sm:p-9">
            {sent ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                <p className="font-medium">Verifique seu email</p>
                <p className="mt-1">
                  Se o email estiver cadastrado, você receberá um link para
                  redefinir a senha. O link expira em 1 hora.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    required
                    className={inputClass}
                  />
                </div>

                <MarketingButton
                  type="submit"
                  size="lg"
                  className="mt-7 w-full"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </MarketingButton>
              </form>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link href="/login" className="text-acolha-muted hover:text-acolha-ink">
              ← Voltar para o login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
