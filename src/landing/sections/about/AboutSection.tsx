'use client';

import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

export function AboutSection({ data, config, sectionIndex, editable, onUpdateContent, onUpdateSectionOverride }: SectionProps) {
  const profile = data.profile;
  if (!profile) return null;

  const title = (config.overrides.title as string) || 'Experiência que transforma';
  const minimal = config.variant === 'minimal';

  const updateSection = (key: string, value: string) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  const updateProfile = (key: string) => (value: string) => {
    onUpdateContent?.(`profile.${key}`, value);
  };

  return (
    <section className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-7xl mx-auto">
        <div className={`grid ${minimal ? '@lg:grid-cols-1 max-w-3xl' : '@lg:grid-cols-2'} gap-6 @sm:p-12 @lg:gap-20 items-center`}>
          <div className="space-y-6 @sm:space-y-8">
            <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium">
              Sobre Mim
            </p>
            <InlineText
              as="h2"
              className="text-3xl @sm:text-4xl @lg:text-5xl font-light tracking-tight text-site-text"
              value={title}
              editable={editable}
              onChange={(v) => updateSection('title', v)}
              placeholder="Título da seção"
            />
            <InlineText
              as="p"
              className="text-base @sm:text-xl text-site-text-muted font-light leading-relaxed"
              value={profile.description}
              editable={editable}
              multiline
              onChange={updateProfile('description')}
              placeholder="Descrição profissional"
            />
          </div>

          {!minimal && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-site-surface to-site-bg rounded-2xl p-8 backdrop-blur-xl border border-white/5 hover:border-site-primary/20 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-site-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <InlineText
                    as="span"
                    className="text-site-text-muted font-light"
                    value={profile.attendanceType}
                    editable={editable}
                    onChange={updateProfile('attendanceType')}
                    placeholder="Tipo de atendimento"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-site-surface to-site-bg rounded-2xl p-8 backdrop-blur-xl border border-white/5 hover:border-site-primary/20 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-site-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <InlineText
                    as="span"
                    className="text-site-text-muted font-light"
                    value={profile.city}
                    editable={editable}
                    onChange={updateProfile('city')}
                    placeholder="Cidade"
                  />
                </div>
              </div>

              {profile.address && (
                <div className="bg-gradient-to-br from-site-surface to-site-bg rounded-2xl p-8 backdrop-blur-xl border border-white/5 hover:border-site-primary/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-site-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <InlineText
                      as="span"
                      className="text-site-text-muted font-light"
                      value={profile.address}
                      editable={editable}
                      onChange={updateProfile('address')}
                      placeholder="Endereço"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
