'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { MarketingButton } from '@/components/features/marketing/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    crp: '',
    email: '',
    password: '',
    confirmPassword: '',
    lgpdConsent: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          crp: form.crp,
          email: form.email,
          password: form.password,
          lgpdConsent: form.lgpdConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar conta');

      // Login automático após o cadastro
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/editor');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
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
          </Link>
          <MarketingButton href="/login" variant="ghost" size="sm">
            Já tenho conta
          </MarketingButton>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-medium tracking-tight text-acolha-ink">
              Crie sua conta
            </h1>
            <p className="mt-3 text-acolha-body">
              Comece com 14 dias grátis. Sem cartão de crédito.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[1.4rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_80px_-35px_rgba(24,49,43,0.25)] sm:p-9"
          >
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Nome profissional
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Ex.: Dra. Maria Santos"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="crp" className={labelClass}>
                  CRP
                </label>
                <input
                  id="crp"
                  value={form.crp}
                  onChange={(e) => update('crp', e.target.value)}
                  placeholder="Ex.: 06/123456"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="voce@email.com"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-acolha-body">
                <input
                  type="checkbox"
                  checked={form.lgpdConsent}
                  onChange={(e) => update('lgpdConsent', e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-acolha-line text-acolha-accent focus:ring-acolha-accent/30"
                />
                <span>
                  Aceito os{' '}
                  <Link href="/privacy" className="font-medium text-acolha-accent underline">
                    termos e a política de privacidade
                  </Link>{' '}
                  (LGPD).
                </span>
              </label>
            </div>

            <MarketingButton
              type="submit"
              size="lg"
              className="mt-7 w-full"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar minha página'}
            </MarketingButton>
          </form>

          <p className="mt-6 text-center text-sm text-acolha-muted">
            Após o cadastro, você já entra no editor para montar sua página.
          </p>
        </div>
      </main>
    </div>
  );
}
