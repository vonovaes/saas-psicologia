'use client';

import { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { SectionProps } from '@/landing/types';

export function ContactSection({ data, config }: SectionProps) {
  const settings = data.settings;
  const title = (config.overrides.title as string) || 'Entre em contato';
  const subtitle =
    (config.overrides.subtitle as string) || 'Tire suas dúvidas ou agende sua primeira consulta';
  const whatsappOnly = config.variant === 'whatsapp-only';

  const [formData, setFormData] = useState({ name: '', phone: '', message: '', consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          source: 'FORMULARIO',
          consentedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error('Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.');
        }
        throw new Error(errorData.error || 'Failed to submit');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', message: '', consent: false });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Erro ao enviar mensagem. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappLink = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`
    : null;

  return (
    <section id="contact" className="py-16 @sm:py-24 @lg:py-32 px-4 bg-site-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 @lg:mb-20">
          <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Contato
          </p>
          <h2 className="text-3xl @sm:text-4xl @lg:text-5xl font-light tracking-tight mb-4 text-site-text">
            {title}
          </h2>
          <p className="text-base @sm:text-xl text-site-text-muted font-light">{subtitle}</p>
        </div>

        <div className="bg-gradient-to-br from-site-surface to-site-bg rounded-3xl p-6 @sm:p-12 backdrop-blur-xl border border-white/5">
          {whatsappOnly ? (
            <div className="text-center space-y-6 @sm:space-y-8">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-site-primary text-site-bg font-medium px-10 py-5 rounded-full text-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Conversar no WhatsApp
                </a>
              ) : (
                <p className="text-site-text-muted font-light">
                  Configure seu número de WhatsApp nas configurações.
                </p>
              )}
              {settings?.instagramHandle && (
                <a
                  href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-site-text-muted hover:text-site-primary transition-colors font-light"
                >
                  Instagram: {settings.instagramHandle}
                </a>
              )}
            </div>
          ) : submitSuccess ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-site-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-10 h-10 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-light mb-3 text-site-text">Mensagem Enviada</h3>
              <p className="text-site-text-muted font-light">Entrarei em contato em breve.</p>
              <Button
                onClick={() => setSubmitSuccess(false)}
                className="mt-8 bg-site-primary text-site-bg font-medium px-8 py-4 rounded-full hover:opacity-90"
              >
                Enviar outra mensagem
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 @sm:space-y-8">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm">
                  {submitError}
                </div>
              )}
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                required
                className="bg-site-surface! border-white/10! text-site-text! placeholder-site-text-muted!"
              />
              <Input
                label="Telefone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
                className="bg-site-surface! border-white/10! text-site-text! placeholder-site-text-muted!"
              />
              <Textarea
                label="Mensagem"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Como posso ajudar?"
                rows={4}
                required
                className="bg-site-surface! border-white/10! text-site-text! placeholder-site-text-muted!"
              />
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  required
                  className="mt-1 w-5 h-5 bg-site-surface border-white/20 rounded"
                />
                <label htmlFor="consent" className="text-sm text-site-text-muted font-light">
                  Concordo com o processamento dos meus dados de contato conforme a{' '}
                  <a href="/privacy" className="text-site-primary hover:opacity-80 underline">
                    Política de Privacidade
                  </a>
                </label>
              </div>
              <Button
                type="submit"
                className="bg-site-primary text-site-bg font-medium px-8 py-4 rounded-full w-full hover:opacity-90"
                size="lg"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
