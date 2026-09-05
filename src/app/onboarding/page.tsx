'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/landing/themes/presets';

const inputClass =
  'w-full rounded-xl border border-acolha-line bg-white px-4 py-3 text-sm text-acolha-ink placeholder:text-acolha-muted/60 focus:border-acolha-accent focus:outline-none focus:ring-2 focus:ring-acolha-accent/20 transition-colors';
const labelClass = 'block text-sm font-medium text-acolha-ink mb-1.5';

/** Campo de lista com chips (adicionar com Enter ou botão) */
function ChipInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setInput('');
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={`${inputClass} flex-1`}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-acolha-accent px-4 text-sm font-semibold text-white hover:bg-acolha-accent-hover transition-colors"
        >
          +
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-acolha-mist px-3 py-1.5 text-sm text-acolha-ink"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label={`Remover ${item}`}
                className="text-acolha-muted hover:text-acolha-ink"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const STEPS = ['Sobre você', 'Especialidades', 'Contato', 'Visual da página'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [attendanceType, setAttendanceType] = useState('Presencial e Online');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [approaches, setApproaches] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [templateId, setTemplateId] = useState('acolhimento');

  const canContinue =
    step === 0 ? city.trim().length > 0 && description.trim().length >= 20 :
    step === 1 ? specialties.length > 0 :
    step === 3 ? !!templateId :
    true;

  const finish = async () => {
    setSaving(true);
    setError('');
    try {
      const profileRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { city, description, specialties, approaches, attendanceType },
          settings: { whatsappNumber: whatsapp, instagramHandle: instagram },
        }),
      });
      if (!profileRes.ok) throw new Error('Erro ao salvar perfil');

      const template = TEMPLATES.find((t) => t.id === templateId)!;
      const themeRes = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', theme: template.preset }),
      });
      if (!themeRes.ok) throw new Error('Erro ao aplicar template');

      router.push('/editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-acolha-bg flex flex-col">
      <header className="px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-xl font-semibold tracking-tight text-acolha-ink">Acolha</span>
          <span className="text-sm text-acolha-muted">
            Passo {step + 1} de {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6">
        <div className="mx-auto max-w-3xl">
          <div className="h-1.5 rounded-full bg-acolha-line overflow-hidden">
            <div
              className="h-full bg-acolha-accent transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-acolha-muted">
            {STEPS.map((label, i) => (
              <span key={label} className={i === step ? 'font-medium text-acolha-ink' : ''}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="flex flex-1 items-start justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <div className="rounded-[1.4rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_80px_-35px_rgba(24,49,43,0.25)] sm:p-9">
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ── Passo 0: Sobre você ─────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <h1 className="text-2xl font-medium text-acolha-ink">
                  Vamos montar sua página em poucos passos
                </h1>
                <p className="text-sm text-acolha-body">
                  Essas informações aparecem na sua página pública.
                </p>
                <div>
                  <label htmlFor="city" className={labelClass}>Cidade de atendimento</label>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex.: São Paulo"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="attendance" className={labelClass}>Tipo de atendimento</label>
                  <select
                    id="attendance"
                    value={attendanceType}
                    onChange={(e) => setAttendanceType(e.target.value)}
                    className={inputClass}
                  >
                    <option>Presencial</option>
                    <option>Online</option>
                    <option>Presencial e Online</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className={labelClass}>
                    Descrição profissional
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Fale sobre sua experiência e como você trabalha (mínimo 20 caracteres)"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* ── Passo 1: Especialidades ─────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <h1 className="text-2xl font-medium text-acolha-ink">Suas especialidades</h1>
                <p className="text-sm text-acolha-body">
                  Digite cada uma e pressione Enter. Elas aparecem como destaques na sua página.
                </p>
                <div>
                  <label className={labelClass}>Especialidades</label>
                  <ChipInput
                    value={specialties}
                    onChange={setSpecialties}
                    placeholder="Ex.: Ansiedade"
                  />
                </div>
                <div>
                  <label className={labelClass}>Abordagens terapêuticas (opcional)</label>
                  <ChipInput
                    value={approaches}
                    onChange={setApproaches}
                    placeholder="Ex.: TCC, Psicanálise"
                  />
                </div>
              </div>
            )}

            {/* ── Passo 2: Contato ────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <h1 className="text-2xl font-medium text-acolha-ink">Como pacientes falam com você</h1>
                <div>
                  <label htmlFor="whatsapp" className={labelClass}>WhatsApp</label>
                  <input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+5511999999999"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className={labelClass}>Instagram (opcional)</label>
                  <input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@seuperfil"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* ── Passo 3: Template ───────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <h1 className="text-2xl font-medium text-acolha-ink">Escolha o visual da página</h1>
                <p className="text-sm text-acolha-body">
                  Você poderá personalizar cores, seções e textos depois, no editor.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplateId(t.id)}
                      aria-pressed={templateId === t.id}
                      className={`rounded-2xl border-2 p-3 text-left transition-all ${
                        templateId === t.id
                          ? 'border-acolha-accent shadow-lg'
                          : 'border-acolha-line hover:border-acolha-accent/50'
                      }`}
                    >
                      <div
                        className="mb-2 h-16 rounded-xl p-2"
                        style={{ backgroundColor: t.swatch.bg }}
                      >
                        <div
                          className="mb-1.5 h-1 w-6 rounded-full"
                          style={{ backgroundColor: t.swatch.primary }}
                        />
                        <div
                          className="h-2 w-14 rounded-full"
                          style={{ backgroundColor: t.swatch.text, opacity: 0.85 }}
                        />
                        <div
                          className="mt-1 h-1.5 w-10 rounded-full"
                          style={{ backgroundColor: t.swatch.text, opacity: 0.4 }}
                        />
                      </div>
                      <p className="text-sm font-semibold text-acolha-ink">{t.name}</p>
                      <p className="text-xs text-acolha-muted">{t.mood}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-medium text-acolha-muted hover:text-acolha-ink"
                >
                  ← Voltar
                </button>
              ) : (
                <span />
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canContinue}
                  className="rounded-full bg-acolha-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-acolha-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  disabled={saving || !canContinue}
                  className="rounded-full bg-acolha-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-acolha-accent-hover disabled:opacity-50"
                >
                  {saving ? 'Publicando...' : 'Concluir e abrir o editor'}
                </button>
              )}
            </div>
          </div>

          {step === 0 && (
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-4 w-full text-center text-sm text-acolha-muted hover:text-acolha-ink"
            >
              Pular por agora — preencher depois
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
