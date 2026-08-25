'use client';

interface LivePreviewProps {
  profile: {
    displayName: string;
    specialties: string[];
    city: string;
    description: string;
    address: string;
    attendanceType: string;
    profileImageUrl: string | null;
  };
  settings: {
    whatsappNumber: string;
    instagramHandle: string;
    googleMapsEmbedUrl: string;
  };
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export function LivePreview({ profile, settings, faqs }: LivePreviewProps) {
  // This is a simplified version of TenantLandingPage for preview
  // In the full implementation, this would use the actual TenantLandingPage component
  // with data overrides instead of API fetching

  return (
    <div className="min-h-screen bg-[#0a0b0c] text-white">
      {/* Preview Indicator */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-xs text-amber-400 font-medium">MODO PREVIEW - Alterações em tempo real</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0c] via-[#121317] to-[#0a0b0c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium">
                  Psicologia Clínica
                </p>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
                  {profile.displayName || 'Seu Nome'}
                </h1>
                <p className="text-xl text-gray-400 font-light">
                  {profile.city || 'Sua Cidade'}
                </p>
              </div>
              
              <p className="text-2xl text-gray-300 font-light leading-relaxed max-w-xl">
                {profile.description || 'Sua descrição profissional aparecerá aqui...'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {profile.specialties.length > 0 ? (
                  profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-amber-500/30 text-amber-400/90 backdrop-blur-sm"
                    >
                      {specialty}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">Suas especialidades aparecerão aqui...</span>
                )}
              </div>
              
              <div className="inline-flex items-center bg-amber-500/10 px-4 py-2 rounded-full text-amber-400 text-sm">
                {profile.attendanceType || 'Tipo de atendimento'}
              </div>
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
                  <p className="text-gray-400 font-light">
                    {profile.profileImageUrl ? 'Foto Carregada' : 'Foto Profissional'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section className="py-20 px-4 bg-[#0a0b0c]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
              Contato
            </p>
            <h2 className="text-4xl font-light tracking-tight mb-4">
              Entre em contato
            </h2>
            <p className="text-xl text-gray-400 font-light">
              Tire suas dúvidas ou agende sua primeira consulta
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-3xl p-12 backdrop-blur-xl border border-white/5">
            <div className="space-y-6">
              <div className="text-gray-400 italic text-center">
                Formulário de contato será renderizado aqui com suas configurações...
              </div>
              
              {settings.whatsappNumber && (
                <div className="text-center">
                  <p className="text-gray-300">
                    WhatsApp: {settings.whatsappNumber}
                  </p>
                </div>
              )}
              
              {settings.instagramHandle && (
                <div className="text-center">
                  <p className="text-gray-300">
                    Instagram: {settings.instagramHandle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 bg-[#0a0b0c]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-amber-400/80 tracking-[0.3em] uppercase text-sm font-medium mb-4">
                Dúvidas
              </p>
              <h2 className="text-4xl font-light tracking-tight">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id || index} className="bg-gradient-to-br from-[#1a1b1e] to-[#121317] rounded-xl p-6 backdrop-blur-xl border border-white/5">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-gray-400 font-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
