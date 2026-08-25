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
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 sticky top-0 z-50 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-xs text-amber-400 font-medium">MODO PREVIEW - Alterações em tempo real</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0c] via-[#121317] to-[#0a0b0c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-500/5 to-blue-500/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <p className="text-amber-400/90 tracking-[0.2em] uppercase text-xs font-semibold">
                    Psicologia Clínica
                  </p>
                </div>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  {profile.displayName || 'Seu Nome'}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-amber-500/50 to-transparent" />
                  <p className="text-xl text-gray-400 font-light">
                    {profile.city || 'Sua Cidade'}
                  </p>
                </div>
              </div>
              
              <p className="text-2xl text-gray-300 font-light leading-relaxed max-w-xl border-l-2 border-amber-500/30 pl-6">
                {profile.description || 'Sua descrição profissional aparecerá aqui...'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {profile.specialties.length > 0 ? (
                  profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-5 py-2.5 rounded-full text-sm font-medium border border-amber-500/30 text-amber-400/90 backdrop-blur-sm bg-gradient-to-r from-amber-500/10 to-transparent hover:from-amber-500/20 transition-all duration-300"
                    >
                      {specialty}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">Suas especialidades aparecerão aqui...</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-5 py-3 rounded-full border border-amber-500/30 backdrop-blur-sm">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-amber-400 text-sm font-medium">
                    {profile.attendanceType || 'Tipo de atendimento'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-amber-600/20 to-blue-500/10 rounded-full blur-3xl opacity-50" />
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-[#1a1b1e] via-[#121317] to-[#0a0b0c] rounded-3xl p-12 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Decorative Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-40 h-40 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-blue-500/10 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border border-amber-500/20 shadow-inner">
                      {profile.profileImageUrl ? (
                        <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.profileImageUrl})` }} />
                      ) : (
                        <svg className="w-20 h-20 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-300 font-medium text-lg">
                      {profile.displayName || 'Nome Profissional'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {profile.profileImageUrl ? 'Foto Profissional' : 'Adicione sua foto'}
                    </p>
                  </div>
                  
                  {settings.whatsappNumber && (
                    <div className="flex items-center justify-center gap-2 text-green-400/80 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp disponível</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section className="py-20 px-4 bg-[#0a0b0c] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0c] via-[#121317] to-[#0a0b0c]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 backdrop-blur-sm mb-6">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-amber-400/90 tracking-[0.2em] uppercase text-xs font-semibold">
                Contato
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Entre em contato
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Tire suas dúvidas ou agende sua primeira consulta
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1b1e] via-[#121317] to-[#0a0b0c] rounded-3xl p-12 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 space-y-8">
              <div className="text-center p-8 bg-gradient-to-r from-amber-500/5 to-blue-500/5 rounded-2xl border border-amber-500/10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-300 font-medium">Formulário de contato</p>
                </div>
                <p className="text-gray-500 text-sm">
                  Será renderizado aqui com suas configurações personalizadas
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {settings.whatsappNumber && (
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-2xl border border-green-500/20 hover:border-green-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">WhatsApp</p>
                      <p className="text-green-400 font-medium">{settings.whatsappNumber}</p>
                    </div>
                  </div>
                )}
                
                {settings.instagramHandle && (
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/5 rounded-2xl border border-pink-500/20 hover:border-pink-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Instagram</p>
                      <p className="text-pink-400 font-medium">{settings.instagramHandle}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 bg-[#0a0b0c] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0c] via-[#121317] to-[#0a0b0c]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm mb-6">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-400/90 tracking-[0.2em] uppercase text-xs font-semibold">
                  Dúvidas
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id || index} className="group bg-gradient-to-br from-[#1a1b1e] via-[#121317] to-[#0a0b0c] rounded-2xl p-6 backdrop-blur-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                      <span className="text-amber-400/80 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2 text-gray-200 group-hover:text-amber-400/90 transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-gray-400 font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
