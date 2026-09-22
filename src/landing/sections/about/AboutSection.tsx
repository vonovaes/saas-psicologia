'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionProps } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';
import {
  Check, MapPin, Home, Video, Calendar, Clock,
  Heart, Star, GraduationCap, Phone, Mail, MessageCircle,
  Plus, X,
  type LucideIcon,
} from 'lucide-react';

interface HighlightItem {
  icon: string;
  text: string;
}

/** Icones disponiveis para os cards de destaque da secao Sobre Mim. */
export const HIGHLIGHT_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  check: { icon: Check, label: 'Confirmação' },
  pin: { icon: MapPin, label: 'Localização' },
  home: { icon: Home, label: 'Consultório' },
  video: { icon: Video, label: 'Atendimento online' },
  calendar: { icon: Calendar, label: 'Agenda' },
  clock: { icon: Clock, label: 'Horários' },
  heart: { icon: Heart, label: 'Cuidado' },
  star: { icon: Star, label: 'Destaque' },
  graduation: { icon: GraduationCap, label: 'Formação' },
  phone: { icon: Phone, label: 'Telefone' },
  mail: { icon: Mail, label: 'Email' },
  message: { icon: MessageCircle, label: 'Mensagem' },
};

function HighlightIcon({ name, className }: { name: string; className?: string }) {
  const Icon = HIGHLIGHT_ICONS[name]?.icon ?? Check;
  return <Icon className={className} />;
}

export function AboutSection({ data, config, sectionIndex, editable, onUpdateSectionOverride }: SectionProps) {
  const profile = data.profile;
  const [picker, setPicker] = useState<{ index: number; top: number; left: number } | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Fecha o seletor em clique fora, Escape ou scroll
  useEffect(() => {
    if (!picker) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (pickerRef.current?.contains(target)) return;
      if (target.closest('[data-icon-trigger]')) return;
      setPicker(null);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPicker(null);
    };
    const handleScroll = () => setPicker(null);
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [picker]);

  if (!profile) return null;

  const title = (config.overrides.title as string) || 'Experiência que transforma';
  const aboutText = (config.overrides.text as string) || '';
  const minimal = config.variant === 'minimal';

  // Cards de destaque: ate a primeira edicao, derivam do perfil
  // (tipo de atendimento, cidade, endereco) para manter o visual atual.
  const savedHighlights = config.overrides.highlights as HighlightItem[] | undefined;
  const derivedHighlights: HighlightItem[] = [
    profile.attendanceType && { icon: 'check', text: profile.attendanceType },
    profile.city && { icon: 'pin', text: profile.city },
    profile.address && { icon: 'home', text: profile.address },
  ].filter(Boolean) as HighlightItem[];
  const highlights = savedHighlights ?? derivedHighlights;

  const updateSection = (key: string, value: unknown) => {
    onUpdateSectionOverride?.(sectionIndex, key, value);
  };

  const updateHighlight = (index: number, patch: Partial<HighlightItem>) => {
    updateSection('highlights', highlights.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  };
  const addHighlight = () => updateSection('highlights', [...highlights, { icon: 'star', text: '' }]);
  const removeHighlight = (index: number) => updateSection('highlights', highlights.filter((_, i) => i !== index));

  const openPicker = (index: number, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (picker?.index === index) {
      setPicker(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const width = 224;
    const height = 148;
    const top =
      window.innerHeight - rect.bottom >= height + 8
        ? rect.bottom + 8
        : Math.max(8, rect.top - height - 8);
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left - width / 2 + rect.width / 2));
    setPicker({ index, top, left });
  };

  return (
    <section className="py-12 @sm:py-16 @lg:py-24 px-4 bg-site-bg">
      <div className="max-w-7xl mx-auto">
        <div className={`grid ${minimal ? '@lg:grid-cols-1 max-w-3xl' : '@lg:grid-cols-2'} gap-6 @sm:p-12 @lg:gap-20 items-center`}>
          <div className="space-y-6 @sm:space-y-8">
            <p className="text-site-primary/80 tracking-[0.3em] uppercase text-sm font-medium">
              Sobre Mim
            </p>
            <InlineText
              as="h2"
              className="site-heading text-3xl @sm:text-4xl @lg:text-5xl text-site-text"
              value={title}
              editable={editable}
              onChange={(v) => updateSection('title', v)}
              placeholder="Título da seção"
            />
            {(aboutText || editable) && (
              <InlineText
                as="p"
                className="text-base @sm:text-xl text-site-text-muted font-light leading-relaxed"
                value={aboutText}
                editable={editable}
                multiline
                onChange={(v) => updateSection('text', v)}
                placeholder="Conte um pouco sobre você, sua formação e experiência"
              />
            )}
          </div>

          {!minimal && (highlights.length > 0 || editable) && (
            <div className="flex flex-col gap-6 items-center">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="site-card p-8 w-full max-w-md hover:border-site-primary/20 transition-all duration-500 relative group/highlight"
                >
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      data-icon-trigger
                      disabled={!editable}
                      onClick={(e) => openPicker(index, e)}
                      title={editable ? 'Trocar ícone' : undefined}
                      className={`w-12 h-12 shrink-0 bg-site-primary/10 rounded-full flex items-center justify-center ${
                        editable ? 'cursor-pointer hover:bg-site-primary/20 hover:ring-2 hover:ring-site-primary/30' : ''
                      }`}
                    >
                      <HighlightIcon name={item.icon} className="w-6 h-6 text-site-primary" />
                    </button>
                    <InlineText
                      as="span"
                      className="text-site-text-muted font-light flex-1"
                      value={item.text}
                      editable={editable}
                      onChange={(v) => updateHighlight(index, { text: v })}
                      placeholder="Informação"
                    />
                  </div>

                  {editable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHighlight(index);
                      }}
                      aria-label="Remover destaque"
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow-md opacity-0 transition-opacity group-hover/highlight:opacity-100 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {editable && (
                <button
                  type="button"
                  onClick={addHighlight}
                  className="w-full max-w-md rounded-xl border-2 border-dashed border-site-primary/30 px-8 py-5 text-sm text-site-text-muted transition-colors hover:border-site-primary/60 hover:text-site-primary flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar destaque
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {editable && picker && (
        <div
          ref={pickerRef}
          className="fixed z-[100] grid w-56 grid-cols-4 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-2xl"
          style={{ top: picker.top, left: picker.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(HIGHLIGHT_ICONS).map(([key, { icon: Icon, label }]) => (
            <button
              key={key}
              type="button"
              title={label}
              onClick={() => {
                updateHighlight(picker.index, { icon: key });
                setPicker(null);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                highlights[picker.index]?.icon === key
                  ? 'bg-acolha-accent text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
