'use client';

import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

interface TestimonialItem {
  name: string;
  text: string;
}

export function TestimonialsSection({ data, config, sectionIndex, editable, onUpdateSectionOverride }: SectionProps) {
  const items = (config.overrides.items as TestimonialItem[]) ?? [];
  if (items.length === 0) return null;

  const title = (config.overrides.title as string) || 'O que dizem os pacientes';
  const variant = config.variant;

  const updateSection = (key: string, value: unknown) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  const updateItem = (index: number, patch: Partial<TestimonialItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    updateSection('items', next);
  };

  return (
    <section className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 @lg:mb-20">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Depoimentos
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

        {variant === 'quotes' ? (
          <div className="space-y-12 max-w-3xl mx-auto">
            {items.map((item, index) => (
              <blockquote key={index} className="text-center">
                <InlineText
                  as="p"
                  className="text-2xl font-light text-site-text-muted leading-relaxed italic"
                  value={item.text}
                  editable={editable}
                  multiline
                  onChange={(v) => updateItem(index, { text: v })}
                  placeholder="Depoimento"
                />
                <footer className="mt-4 text-site-primary font-medium">
                  — <InlineText
                    as="span"
                    className="text-site-primary font-medium"
                    value={item.name}
                    editable={editable}
                    onChange={(v) => updateItem(index, { name: v })}
                    placeholder="Nome do paciente"
                  />
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <div className="grid @md:grid-cols-2 gap-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-site-surface to-site-bg rounded-3xl p-8 backdrop-blur-xl border border-white/5"
              >
                <svg className="w-8 h-8 text-site-primary/60 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <InlineText
                  as="p"
                  className="text-site-text-muted font-light leading-relaxed mb-4"
                  value={item.text}
                  editable={editable}
                  multiline
                  onChange={(v) => updateItem(index, { text: v })}
                  placeholder="Depoimento"
                />
                <p className="text-site-text font-medium text-sm">
                  — <InlineText
                    as="span"
                    className="text-site-text font-medium text-sm"
                    value={item.name}
                    editable={editable}
                    onChange={(v) => updateItem(index, { name: v })}
                    placeholder="Nome do paciente"
                  />
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
