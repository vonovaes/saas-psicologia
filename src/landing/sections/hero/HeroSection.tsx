'use client';

import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

export function HeroSection({ data, config, sectionIndex, editable, onUpdateContent, onUpdateSectionOverride }: SectionProps) {
  const profile = data.profile;
  if (!profile) return null;

  const eyebrow = (config.overrides.eyebrow as string) || 'Psicologia Clínica';
  const ctaText = (config.overrides.ctaText as string) || 'Agendar Consulta';
  const variant = config.variant;

  const updateSection = (key: string, value: string) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  const updateProfile = (key: string) => (value: string) => {
    onUpdateContent?.(`profile.${key}`, value);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Variant: minimal (só tipografia) ─────────────────────────
  if (variant === 'minimal') {
    return (
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-site-bg">
        <div className="relative z-10 max-w-4xl mx-auto px-4 @sm:px-6 @lg:px-8 py-12 @sm:py-20">
          <InlineText
            as="p"
            className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-6"
            value={eyebrow}
            editable={editable}
            onChange={(v) => updateSection('eyebrow', v)}
            placeholder="Chapéu"
          />
          <InlineText
            as="h1"
            className="text-4xl @sm:text-5xl @lg:text-7xl font-light tracking-tight leading-tight text-site-text mb-6"
            value={profile.displayName}
            editable={editable}
            onChange={updateProfile('displayName')}
            placeholder="Nome do profissional"
          />
          <InlineText
            as="p"
            className="text-base @sm:text-xl text-site-text-muted font-light mb-8"
            value={profile.city}
            editable={editable}
            onChange={updateProfile('city')}
            placeholder="Cidade"
          />
          <InlineText
            as="p"
            className="text-lg @sm:text-2xl text-site-text-muted font-light leading-relaxed max-w-2xl mb-10"
            value={profile.description}
            editable={editable}
            multiline
            onChange={updateProfile('description')}
            placeholder="Descrição profissional"
          />
          <button
            onClick={scrollToContact}
            className="bg-site-primary text-site-bg font-medium px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            {editable ? (
              <InlineText
                as="span"
                value={ctaText}
                editable={editable}
                onChange={(v) => updateSection('ctaText', v)}
                placeholder="Texto do botão"
              />
            ) : (
              ctaText
            )}
          </button>
        </div>
      </section>
    );
  }

  // ── Variant: centered ────────────────────────────────────────
  if (variant === 'centered') {
    return (
      <section className="relative min-h-[70vh] @sm:min-h-screen flex items-center justify-center overflow-hidden bg-site-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-site-primary/15 via-transparent to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 @sm:px-6 @lg:px-8 py-12 @sm:py-20 text-center">
          <div className="w-40 h-40 bg-site-primary/20 rounded-full mx-auto mb-8 flex items-center justify-center border border-site-primary/20 overflow-hidden">
            {profile.profileImageUrl ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${profile.profileImageUrl})` }}
              />
            ) : (
              <svg className="w-20 h-20 text-site-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <InlineText
            as="p"
            className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4"
            value={eyebrow}
            editable={editable}
            onChange={(v) => updateSection('eyebrow', v)}
            placeholder="Chapéu"
          />
          <InlineText
            as="h1"
            className="text-4xl @sm:text-5xl @lg:text-7xl font-light tracking-tight leading-tight text-site-text mb-4"
            value={profile.displayName}
            editable={editable}
            onChange={updateProfile('displayName')}
            placeholder="Nome do profissional"
          />
          <InlineText
            as="p"
            className="text-base @sm:text-xl text-site-text-muted font-light mb-8"
            value={profile.city}
            editable={editable}
            onChange={updateProfile('city')}
            placeholder="Cidade"
          />
          <InlineText
            as="p"
            className="text-lg @sm:text-2xl text-site-text-muted font-light leading-relaxed max-w-2xl mx-auto mb-10"
            value={profile.description}
            editable={editable}
            multiline
            onChange={updateProfile('description')}
            placeholder="Descrição profissional"
          />
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {profile.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium border border-site-primary/30 text-site-primary/90"
              >
                {specialty}
              </span>
            ))}
          </div>
          {(profile.approaches ?? []).length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {(profile.approaches ?? []).map((approach, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-site-surface text-site-text-muted border border-white/10"
              >
                  {approach}
                </span>
              ))}
            </div>
          )}
          <button
            onClick={scrollToContact}
            className="bg-site-primary text-site-bg font-medium px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            {editable ? (
              <InlineText
                as="span"
                value={ctaText}
                editable={editable}
                onChange={(v) => updateSection('ctaText', v)}
                placeholder="Texto do botão"
              />
            ) : (
              ctaText
            )}
          </button>
        </div>
      </section>
    );
  }

  // ── Variant: split (padrão — visual atual) ───────────────────
  return (
    <section className="relative min-h-[70vh] @sm:min-h-screen flex items-center justify-center overflow-hidden bg-site-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-site-bg via-site-surface to-site-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-site-primary/15 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-12 @sm:py-20">
        <div className="grid @lg:grid-cols-2 gap-10 @lg:gap-16 items-center">
          <div className="space-y-6 @sm:space-y-8">
            <div className="space-y-4">
              <InlineText
                as="p"
                className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium"
                value={eyebrow}
                editable={editable}
                onChange={(v) => updateSection('eyebrow', v)}
                placeholder="Chapéu"
              />
              <InlineText
                as="h1"
                className="text-4xl @sm:text-5xl @lg:text-7xl font-light tracking-tight leading-tight text-site-text"
                value={profile.displayName}
                editable={editable}
                onChange={updateProfile('displayName')}
                placeholder="Nome do profissional"
              />
              <InlineText
                as="p"
                className="text-base @sm:text-xl text-site-text-muted font-light"
                value={profile.city}
                editable={editable}
                onChange={updateProfile('city')}
                placeholder="Cidade"
              />
            </div>

            <InlineText
              as="p"
              className="text-lg @sm:text-2xl text-site-text-muted font-light leading-relaxed max-w-xl"
              value={profile.description}
              editable={editable}
              multiline
              onChange={updateProfile('description')}
              placeholder="Descrição profissional"
            />

            <div className="flex flex-wrap gap-3">
              {profile.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-site-primary/30 text-site-primary/90 backdrop-blur-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {(profile.approaches ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(profile.approaches ?? []).map((approach, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-site-surface text-site-text-muted border border-white/10"
                  >
                    {approach}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={scrollToContact}
              className="bg-site-primary text-site-bg font-medium px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              {editable ? (
                <InlineText
                  as="span"
                  value={ctaText}
                  editable={editable}
                  onChange={(v) => updateSection('ctaText', v)}
                  placeholder="Texto do botão"
                />
              ) : (
                ctaText
              )}
            </button>
          </div>

          <div className="relative">
            <div className="aspect-square bg-site-primary/20 rounded-full blur-3xl absolute inset-0" />
            <div className="relative bg-gradient-to-br from-site-surface to-site-bg rounded-3xl p-6 @sm:p-12 backdrop-blur-xl border border-white/5">
              <div className="text-center">
                <div className="w-32 h-32 bg-site-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                  {profile.profileImageUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${profile.profileImageUrl})` }}
                    />
                  ) : (
                    <svg className="w-16 h-16 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <p className="text-site-text-muted font-light">Foto Profissional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
