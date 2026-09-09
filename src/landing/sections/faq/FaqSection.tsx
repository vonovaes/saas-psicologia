'use client';

import { Accordion } from '@/components/ui';
import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

export function FaqSection({ data, config, sectionIndex, editable, onUpdateContent, onUpdateSectionOverride }: SectionProps) {
  const faqs = data.faqs;
  if (!faqs || faqs.length === 0) return null;

  const title = (config.overrides.title as string) || 'Perguntas Frequentes';
  const variant = config.variant;

  const updateSection = (key: string, value: string) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  const updateFaq = (index: number, patch: { question?: string; answer?: string }) => {
    const next = faqs.map((faq, i) => (i === index ? { ...faq, ...patch } : faq));
    onUpdateContent?.('faqs', next);
  };

  return (
    <section className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 @lg:mb-20">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Dúvidas
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

        {variant === 'cards' ? (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="bg-gradient-to-br from-site-surface to-site-bg rounded-2xl p-6 backdrop-blur-xl border border-white/5 hover:border-site-primary/30 transition-all duration-300"
              >
                <InlineText
                  as="h3"
                  className="text-lg font-semibold mb-2 text-site-text"
                  value={faq.question}
                  editable={editable}
                  onChange={(v) => updateFaq(index, { question: v })}
                  placeholder="Pergunta"
                />
                <InlineText
                  as="p"
                  className="text-site-text-muted font-light leading-relaxed"
                  value={faq.answer}
                  editable={editable}
                  multiline
                  onChange={(v) => updateFaq(index, { answer: v })}
                  placeholder="Resposta"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-site-surface to-site-bg rounded-3xl backdrop-blur-xl border border-white/5">
            <Accordion
              items={faqs.map((faq, index) => ({
                title: (
                  <InlineText
                    as="span"
                    value={faq.question}
                    editable={editable}
                    onChange={(v) => updateFaq(index, { question: v })}
                    placeholder="Pergunta"
                  />
                ),
                content: (
                  <InlineText
                    as="p"
                    value={faq.answer}
                    editable={editable}
                    multiline
                    onChange={(v) => updateFaq(index, { answer: v })}
                    placeholder="Resposta"
                  />
                ),
              }))}
            />
          </div>
        )}
      </div>
    </section>
  );
}
