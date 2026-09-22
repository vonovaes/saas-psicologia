'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/landing/themes/presets';

const inputClass =
  'w-full rounded-xl border border-acolha-line bg-white px-4 py-3 text-sm text-acolha-ink placeholder:text-acolha-muted/60 focus:border-acolha-accent focus:outline-none focus:ring-2 focus:ring-acolha-accent/20 transition-colors';
const labelClass = 'block text-sm font-medium text-acolha-ink mb-1.5';

interface ChipInputProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  helper?: string;
}

/** Campo de lista com chips (adicionar com Enter ou botão) */
function ChipInput({ value, onChange, placeholder, helper }: ChipInputProps) {
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
      {helper && <p className="mt-1.5 text-xs text-acolha-muted">{helper}</p>}
      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
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

function StepHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-medium text-acolha-ink">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-acolha-body">{subtitle}</p>}
      {children}
    </div>
  );
}

function HelperCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-acolha-line bg-acolha-bg/60 p-4 text-sm text-acolha-body">
      {children}
    </div>
  );
}

const STEPS = ['Sobre você', 'Foto', 'Especialidades', 'Contato', 'FAQ', 'Visual'];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_SUGGESTIONS = [
  'Como funciona a primeira sessão?',
  'Atende online ou presencial?',
  'Qual o valor da sessão?',
  'Qual a duração e frequência das sessões?',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [attendanceType, setAttendanceType] = useState('Presencial e Online');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [approaches, setApproaches] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [templateId, setTemplateId] = useState('acolhimento');

  const mainRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Foco no primeiro campo util a cada etapa
    const main = mainRef.current;
    if (!main) return;
    const focusable = main.querySelector<HTMLElement>(
      'input:not([type=hidden]), textarea, select, button'
    );
    focusable?.focus();
  }, [step]);

  const canContinue =
    step === 0
      ? city.trim().length > 0 && description.trim().length >= 20
      : step === 2
      ? specialties.length > 0
      : step === 5
      ? !!templateId
      : true;

  const handlePhotoSelect = async (file: File) => {
    setError('');
    setPhotoPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.file?.url) {
        throw new Error(data?.error ?? 'Erro no upload da foto');
      }
      setPhotoUrl(data.file.url);
    } catch (err) {
      setPhotoPreview('');
      setError(err instanceof Error ? err.message : 'Erro no upload da foto');
    } finally {
      setUploading(false);
    }
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const finish = async () => {
    setSaving(true);
    setError('');
    try {
      const profileRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            city,
            description,
            specialties,
            approaches,
            attendanceType,
            profileImageUrl: photoUrl,
          },
          settings: { whatsappNumber: whatsapp, instagramHandle: instagram },
        }),
      });
      if (!profileRes.ok) throw new Error('Erro ao salvar perfil');

      const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
      if (validFaqs.length > 0) {
        const faqRes = await fetch('/api/faq', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ faqs: validFaqs }),
        });
        if (!faqRes.ok) throw new Error('Erro ao salvar perguntas frequentes');
      }

      const template = TEMPLATES.find((t) => t.id === templateId)!;
      const themeRes = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'draft', draft: template.preset }),
      });
      if (!themeRes.ok) throw new Error('Erro ao aplicar template');

      // Leva direto ao editor em modo tour — o usuário revisa e publica lá
      router.push('/editor?tour=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-acolha-bg flex flex-col">
      <header className="px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-xl font-semibold tracking-tight text-acolha-ink">
            Acolha<span className="text-acolha-accent">.</span>
          </span>
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

      <main ref={mainRef} className="flex flex-1 items-start justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <div
            aria-live="polite"
            className="rounded-[1.4rem] border border-white/80 bg-white/90 p-7 shadow-[0_28px_80px_-35px_rgba(24,49,43,0.25)] sm:p-9"
          >
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ── Passo 0: Sobre você ─────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <StepHeader
                  title="Vamos montar sua página profissional"
                  subtitle="Essas informações vão aparecer na sua página pública. Você pode editar tudo depois."
                />
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
                  <p className="mt-1.5 text-xs text-acolha-muted">
                    {description.trim().length >= 20
                      ? '✓ Ótimo, essa descrição já aparece bem na página.'
                      : `Faltam ${Math.max(0, 20 - description.trim().length)} caracteres.`}
                  </p>
                </div>

                <HelperCard>
                  <strong className="text-acolha-ink">Dica:</strong> seu nome e e-mail já vêm do
                  cadastro. No editor você poderá trocar a foto e ajustar cada texto.
                </HelperCard>
              </div>
            )}

            {/* ── Passo 1: Foto ──────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <StepHeader
                  title="Sua foto profissional"
                  subtitle="Ela aparece no topo da página e passa confiança para quem visita. Opcional — você pode adicionar depois."
                />
                <div className="flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="group relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-acolha-line bg-acolha-mist transition-colors hover:border-acolha-accent focus:outline-none focus:ring-2 focus:ring-acolha-accent/30"
                    aria-label="Enviar foto de perfil"
                  >
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreview}
                        alt="Prévia da foto de perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-acolha-muted transition-colors group-hover:text-acolha-accent">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                        </svg>
                        <span className="text-xs font-medium">Adicionar</span>
                      </span>
                    )}
                    {uploading && (
                      <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-medium text-acolha-ink">
                        Enviando...
                      </span>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoSelect(file);
                      e.target.value = '';
                    }}
                  />
                  {photoPreview && !uploading && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('');
                        setPhotoUrl('');
                      }}
                      className="text-xs font-medium text-acolha-muted hover:text-red-600"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
                <HelperCard>
                  <strong className="text-acolha-ink">Dica:</strong> use uma foto nítida, com fundo
                  neutro e olhando para a câmera — é o que mais gera confiança.
                </HelperCard>
              </div>
            )}

            {/* ── Passo 2: Especialidades ─────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <StepHeader
                  title="Suas especialidades"
                  subtitle="Elas aparecem como destaques logo na abertura da página."
                />
                <div>
                  <label className={labelClass}>Especialidades</label>
                  <ChipInput
                    value={specialties}
                    onChange={setSpecialties}
                    placeholder="Ex.: Ansiedade"
                    helper="Digite e pressione Enter. Adicione quantas quiser."
                  />
                </div>
                <div>
                  <label className={labelClass}>Abordagens terapêuticas (opcional)</label>
                  <ChipInput
                    value={approaches}
                    onChange={setApproaches}
                    placeholder="Ex.: TCC, Psicanálise"
                    helper="Você também pode deixar em branco e adicionar depois."
                  />
                </div>
              </div>
            )}

            {/* ── Passo 3: Contato ────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <StepHeader
                  title="Como pacientes falam com você"
                  subtitle="O botão de WhatsApp fica sempre visível na sua página."
                />
                <div>
                  <label htmlFor="whatsapp" className={labelClass}>WhatsApp</label>
                  <input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+5511999999999"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-acolha-muted">
                    O número com DDD. Pacientes clicam e vão direto para a conversa.
                  </p>
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

            {/* ── Passo 4: FAQ ────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <StepHeader
                  title="Perguntas frequentes"
                  subtitle="Responda o que pacientes costumam perguntar. Opcional — até 5 perguntas."
                />
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-xl border border-acolha-line bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-acolha-muted">
                        Pergunta {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFaqs((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-xs font-medium text-acolha-muted hover:text-red-600"
                      >
                        Remover
                      </button>
                    </div>
                    <input
                      value={faq.question}
                      onChange={(e) => updateFaq(i, 'question', e.target.value)}
                      placeholder="Pergunta"
                      className={inputClass}
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                      placeholder="Resposta"
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                ))}
                {faqs.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setFaqs((prev) => [...prev, { question: '', answer: '' }])}
                    className="w-full rounded-xl border-2 border-dashed border-acolha-line py-3 text-sm font-medium text-acolha-muted transition-colors hover:border-acolha-accent hover:text-acolha-accent"
                  >
                    + Adicionar pergunta
                  </button>
                )}
                {faqs.length === 0 && (
                  <HelperCard>
                    <strong className="text-acolha-ink">Sem ideias?</strong> Exemplos comuns:{' '}
                    {FAQ_SUGGESTIONS.join(' · ')}
                  </HelperCard>
                )}
              </div>
            )}

            {/* ── Passo 5: Template ───────────────────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <StepHeader
                  title="Escolha o visual da página"
                  subtitle="Depois você pode trocar cores, tipografia e seções no editor."
                />
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
                <HelperCard>
                  Não precisa acertar de primeira. No editor você pode testar todos os templates e
                  ajustar as cores como quiser.
                </HelperCard>
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
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="text-sm text-acolha-muted hover:text-acolha-ink"
                >
                  Preencher depois
                </button>
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
                  {saving ? 'Publicando...' : 'Publicar minha página'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
