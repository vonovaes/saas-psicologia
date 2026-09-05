'use client';

import { SectionProps } from '@/landing/types';

interface TestimonialItem {
  name: string;
  text: string;
}

export function TestimonialsSection({ data, config }: SectionProps) {
  const items = (config.overrides.items as TestimonialItem[]) ?? [];
  if (items.length === 0) return null;

  const title = (config.overrides.title as string) || 'O que dizem os pacientes';
  const variant = config.variant;

  return (
    <section className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 @lg:mb-20">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Depoimentos
          </p>
          <h2 className="text-3xl @sm:text-4xl @lg:text-5xl font-light tracking-tight text-site-text">
            {title}
          </h2>
        </div>

        {variant === 'quotes' ? (
          <div className="space-y-12 max-w-3xl mx-auto">
            {items.map((item, index) => (
              <blockquote key={index} className="text-center">
                <p className="text-2xl font-light text-site-text-muted leading-relaxed italic">
                  “{item.text}”
                </p>
                <footer className="mt-4 text-site-primary font-medium">— {item.name}</footer>
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
                <p className="text-site-text-muted font-light leading-relaxed mb-4">{item.text}</p>
                <p className="text-site-text font-medium text-sm">— {item.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
