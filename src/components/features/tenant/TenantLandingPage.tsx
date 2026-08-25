'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Textarea, Accordion } from '@/components/ui';

interface PublicData {
  profile: {
    displayName: string;
    specialties: string[];
    city: string;
    description: string;
    address: string;
    attendanceType: string;
    profileImageUrl: string | null;
  } | null;
  settings: {
    whatsappNumber: string;
    instagramHandle: string;
    googleMapsEmbedUrl: string;
  } | null;
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export default function TenantLandingPage() {
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const response = await fetch('/api/public/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching public data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      setSubmitError(error instanceof Error ? error.message : 'Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0c]">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0c]">
        <div className="text-gray-400">Página não encontrada</div>
      </div>
    );
  }

  const { profile, settings, faqs } = data;

  return (
    <div className="min-h-screen bg-[#0a0b0c] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0c] via-[#121317] to-[#0a0b0c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium">
                  Psicologia Clínica
                </p>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
                  {profile.displayName}
                </h1>
                <p className="text-xl text-gray-400 font-light">
                  {profile.city}
                </p>
              </div>
              
              <p className="text-2xl text-gray-300 font-light leading-relaxed max-w-xl">
                {profile.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {profile.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-amber-500/30 text-amber-400/90 backdrop-blur-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              
              <Button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-8 py-4 rounded-full"
                size="lg"
              >
                Agendar Consulta
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full blur-3xl absolute inset-0" />
              <div className="relative bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-3xl p-12 backdrop-blur-xl border border-white/5">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-light">Foto Profissional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-[#0a0b0c]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium">
                Sobre Mim
              </p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight">
                Experiência que transforma
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                Sou psicólogo clínico com foco em proporcionar um ambiente acolhedor e seguro para que você possa explorar seus sentimentos e encontrar caminhos para o seu bem-estar.
              </p>
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                Minha abordagem é baseada na terapia cognitivo-comportamental, combinando técnicas comprovadas com empatia e compreensão individual.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-2xl p-8 backdrop-blur-xl border border-white/5 hover:border-amber-500/20 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 font-light">{profile.attendanceType}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-2xl p-8 backdrop-blur-xl border border-white/5 hover:border-amber-500/20 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 font-light">{profile.city}</span>
                </div>
              </div>
              
              {profile.address && (
                <div className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-2xl p-8 backdrop-blur-xl border border-white/5 hover:border-amber-500/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-light">{profile.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-32 px-4 bg-[#0a0b0c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
              Especialidades
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Áreas de atuação
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {profile.specialties.map((specialty, index) => (
              <div key={index} className="group bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-3xl p-10 backdrop-blur-xl border border-white/5 hover:border-amber-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light mb-3 text-gray-200">{specialty}</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Tratamento especializado e personalizado.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-32 px-4 bg-[#0a0b0c]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
                Dúvidas
              </p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight">
                Perguntas Frequentes
              </h2>
            </div>
            
            <div className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-3xl backdrop-blur-xl border border-white/5">
              <Accordion
                items={faqs.map(faq => ({
                  title: faq.question,
                  content: faq.answer,
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 bg-[#0a0b0c]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
              Contato
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Entre em contato
            </h2>
            <p className="text-xl text-gray-400 font-light">
              Tire suas dúvidas ou agende sua primeira consulta
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-3xl p-12 backdrop-blur-xl border border-white/5">
            {submitSuccess ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-light mb-3">Mensagem Enviada</h3>
                <p className="text-gray-400 font-light">Entrarei em contato em breve.</p>
                <Button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-8 bg-amber-500 hover:bg-amber-400 text-black font-medium px-8 py-4 rounded-full"
                >
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
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
                  className="bg-[#1a1b1e] border-white/10 text-white placeholder-gray-500"
                />
                <Input
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                  className="bg-[#1a1b1e] border-white/10 text-white placeholder-gray-500"
                />
                <Textarea
                  label="Mensagem"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Como posso ajudar?"
                  rows={4}
                  required
                  className="bg-[#1a1b1e] border-white/10 text-white placeholder-gray-500"
                />
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    required
                    className="mt-1 w-5 h-5 bg-[#1a1b1e] border-white/20 rounded focus:ring-amber-500/50"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-400 font-light">
                    Concordo com o processamento dos meus dados de contato conforme a{" "}
                    <a href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-8 py-4 rounded-full w-full"
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

      {/* Footer */}
      <footer className="bg-[#0a0b0c] border-t border-white/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-light mb-4">{profile.displayName}</h3>
              <p className="text-gray-400 font-light">{profile.city}</p>
              {profile.address && <p className="text-gray-400 font-light mt-2">{profile.address}</p>}
            </div>
            <div>
              <h3 className="text-lg font-light mb-6 text-gray-300">Contato</h3>
              {settings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-amber-400 transition-colors mb-3 font-light"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              )}
              {settings?.instagramHandle && (
                <a
                  href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-amber-400 transition-colors font-light"
                >
                  Instagram: {settings.instagramHandle}
                </a>
              )}
              <a
                href="/privacy"
                className="block text-gray-400 hover:text-amber-400 transition-colors font-light mt-3"
              >
                Política de Privacidade
              </a>
            </div>
            <div>
              <h3 className="text-lg font-light mb-6 text-gray-300">Atendimento</h3>
              <p className="text-gray-400 font-light">{profile.attendanceType}</p>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-gray-500 font-light">
              &copy; {new Date().getFullYear()} {profile.displayName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
