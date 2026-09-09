'use client';

import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

export function SpecialtiesSection({ data, config, sectionIndex, editable, onUpdateContent, onUpdateSectionOverride }: SectionProps) {
  const profile = data.profile;
  if (!profile || profile.specialties.length === 0) return null;

  const title = (config.overrides.title as string) || 'Áreas de atuação';
  const variant = config.variant;

  const updateSection = (key: string, value: string) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  const updateSpecialty = (index: number, value: string) => {
    const next = [...profile.specialties];
    next[index] = value;
    onUpdateContent?.('profile.specialties', next);
  };

  return (
    <section className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 @lg:mb-20">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Especialidades
          </p>
          <InlineText
            as="h2"
            className="text-3xl @sm:text-4xl @lg:text-5xl font-light tracking-tight text-site-text"
            value={title}
            editable={editable}
            onChange={(v) => updateSection('title', v)}
            placeholder="Título da seção"
          />
        </div>

        {variant === 'tags' && (
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {profile.specialties.map((specialty, index) => (
              <InlineText
                key={index}
                as="span"
                className="px-6 py-3 rounded-full text-base font-medium border border-site-primary/30 text-site-primary/90 bg-site-surface/50 backdrop-blur-sm"
                value={specialty}
                editable={editable}
                onChange={(v) => updateSpecialty(index, v)}
                placeholder="Especialidade"
              />
            ))}
          </div>
        )}

        {variant === 'list' && (
          <div className="max-w-3xl mx-auto divide-y divide-white/5">
            {profile.specialties.map((specialty, index) => (
              <div key={index} className="py-8 flex items-baseline gap-6">
                <span className="text-site-primary/60 font-light text-lg">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <InlineText
                  as="h3"
                  className="text-2xl font-light text-site-text"
                  value={specialty}
                  editable={editable}
                  onChange={(v) => updateSpecialty(index, v)}
                  placeholder="Especialidade"
                />
              </div>
            ))}
          </div>
        )}

        {variant === 'cards' && (
          <div className="grid @md:grid-cols-3 gap-8">
            {profile.specialties.map((specialty, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-site-surface to-site-bg rounded-3xl p-10 backdrop-blur-xl border border-white/5 hover:border-site-primary/30 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-site-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <InlineText
                  as="h3"
                  className="text-2xl font-light mb-3 text-site-text"
                  value={specialty}
                  editable={editable}
                  onChange={(v) => updateSpecialty(index, v)}
                  placeholder="Especialidade"
                />
                <p className="text-site-text-muted font-light leading-relaxed">
                  Tratamento especializado e personalizado.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
