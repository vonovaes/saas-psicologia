'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MarketingButton } from '@/components/features/marketing/ui/button';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setDone(true);
      } else {
        setError(data?.error ?? 'Erro ao redefinir senha. Tente novamente.');
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
              Redefinir senha
            </h1>
            <p className="mt-3 text-acolha-body">
              Escolha uma nova senha para sua conta.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_80px_-35px_rgba(24,49,43,0.25)] sm:p-9">
            {!token ? (
              <div className="rounded-xl bg-amber-50 px-4 py-4 text-sm text-amber-800">
                <p className="font-medium">Link inválido</p>
                <p className="mt-1">
                  Este link de recuperação está incompleto. Solicite um novo em{' '}
                  <Link href="/forgot-password" className="font-medium underline">
                    recuperar senha
                  </Link>
                  .
                </p>
              </div>
            ) : done ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                <p className="font-medium">Senha redefinida!</p>
                <p className="mt-1">
                  Sua senha foi alterada com sucesso.{' '}
                  <Link href="/login" className="font-medium underline">
                    Fazer login
                  </Link>
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

                <div className="space-y-5">
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Nova senha
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-acolha-muted hover:text-acolha-ink transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-acolha-muted">
                      Mínimo 8 caracteres, com maiúscula, minúscula e número.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm" className={labelClass}>
                      Confirmar senha
                    </label>
                    <input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <MarketingButton
                  type="submit"
                  size="lg"
                  className="mt-7 w-full"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Redefinir senha'}
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
