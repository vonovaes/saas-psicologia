'use client';

import { Accordion } from '@/components/ui';
import { SectionProps } from '@/landing/types';

export function FaqSection({ data, config }: SectionProps) {
  const faqs = data.faqs;
  if (!faqs || faqs.length === 0) return null;

  const title = (config.overrides.title as string) || 'Perguntas Frequentes';
  const variant = config.variant;

  return (
    <section className="py-32 px-4 bg-site-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Dúvidas
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-site-text">
            {title}
          </h2>
        </div>

        {variant === 'cards' ? (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="bg-gradient-to-br from-site-surface to-site-bg rounded-2xl p-6 backdrop-blur-xl border border-white/5 hover:border-site-primary/30 transition-all duration-300"
              >
                <h3 className="text-lg font-medium mb-2 text-site-text">{faq.question}</h3>
                <p className="text-site-text-muted font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-site-surface to-site-bg rounded-3xl backdrop-blur-xl border border-white/5">
            <Accordion
              items={faqs.map((faq) => ({
                title: faq.question,
                content: faq.answer,
              }))}
            />
          </div>
        )}
      </div>
    </section>
  );
}
