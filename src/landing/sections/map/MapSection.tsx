'use client';

import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

export function MapSection({ data, config, sectionIndex, editable, onUpdateContent, onUpdateSectionOverride }: SectionProps) {
  const embedUrl = data.settings?.googleMapsEmbedUrl;
  const address = data.profile?.address;
  if (!embedUrl && !address) return null;

  const title = (config.overrides.title as string) || 'Onde atendo';

  const updateSection = (key: string, value: string) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  return (
    <section className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Localização
          </p>
          <InlineText
            as="h2"
            className="text-3xl @sm:text-4xl @lg:text-5xl font-light tracking-tight text-site-text"
            value={title}
            editable={editable}
            onChange={(v) => updateSection('title', v)}
            placeholder="Título da seção"
          />
          {address && (
            <InlineText
              as="p"
              className="mt-4 text-base @sm:text-xl text-site-text-muted font-light"
              value={address}
              editable={editable}
              onChange={(v) => onUpdateContent?.('profile.address', v)}
              placeholder="Endereço"
            />
          )}
        </div>
        {embedUrl && (
          <div className="rounded-3xl overflow-hidden border border-white/5 aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do consultório"
            />
          </div>
        )}
      </div>
    </section>
  );
}
