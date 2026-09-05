import { SectionConfig, SectionType } from './themes/tokens';

// ─── Dados do site do tenant ────────────────────────────────────

export interface SiteProfile {
  displayName: string;
  specialties: string[];
  city: string;
  description: string;
  address: string;
  attendanceType: string;
  profileImageUrl: string | null;
}

export interface SiteSettings {
  whatsappNumber: string;
  instagramHandle: string;
  googleMapsEmbedUrl: string;
}

export interface SiteFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SiteData {
  profile: SiteProfile | null;
  settings: SiteSettings | null;
  faqs: SiteFaq[];
}

// ─── Contrato de seção ──────────────────────────────────────────

export interface SectionProps {
  data: SiteData;
  config: SectionConfig;
}

/** Descriptor de um campo editável de uma seção (modelo Shopify). */
export interface SettingField {
  id: string;
  type: 'text' | 'textarea' | 'image' | 'select' | 'list' | 'color';
  label: string;
  /** Caminho de dados do tenant, ex: 'profile.displayName' */
  source?: string;
  default?: unknown;
  options?: { value: string; label: string }[];
}

export interface SectionSchema {
  type: SectionType;
  name: string;
  description: string;
  variants: { id: string; label: string }[];
  settings: SettingField[];
}
