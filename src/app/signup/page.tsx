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
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    crp: '',
    email: '',
    password: '',
    confirmPassword: '',
    lgpdConsent: false,
  });

  const passwordRules = [
    { label: 'Mínimo 8 caracteres', ok: form.password.length >= 8 },
    { label: 'Uma letra maiúscula', ok: /[A-Z]/.test(form.password) },
    { label: 'Uma letra minúscula', ok: /[a-z]/.test(form.password) },
    { label: 'Um número', ok: /[0-9]/.test(form.password) },
  ];
  const passwordValid = passwordRules.every((r) => r.ok);

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

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
        router.push('/onboarding');
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
            <span className="text-acolha-accent">.</span>
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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-acolha-muted hover:text-acolha-ink transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Checklist de requisitos */}
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                  {passwordRules.map((rule) => (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        rule.ok ? 'text-green-700' : 'text-acolha-muted'
                      }`}
                    >
                      <span aria-hidden="true">{rule.ok ? '✓' : '○'}</span>
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                  className={inputClass}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600">As senhas não coincidem</p>
                )}
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
