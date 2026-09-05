import { ComponentType } from 'react';
import { SectionProps, SectionSchema } from '../types';
import { SectionType } from '../themes/tokens';

import { HeroSection } from './hero/HeroSection';
import { heroSchema } from './hero/schema';
import { AboutSection } from './about/AboutSection';
import { aboutSchema } from './about/schema';
import { SpecialtiesSection } from './specialties/SpecialtiesSection';
import { specialtiesSchema } from './specialties/schema';
import { FaqSection } from './faq/FaqSection';
import { faqSchema } from './faq/schema';
import { ContactSection } from './contact/ContactSection';
import { contactSchema } from './contact/schema';

interface SectionModule {
  component: ComponentType<SectionProps>;
  schema: SectionSchema;
}

/**
 * Registro central de seções. O editor e o SiteRenderer
 * descobrem seções disponíveis a partir daqui.
 */
export const SECTION_REGISTRY: Partial<Record<SectionType, SectionModule>> = {
  hero: { component: HeroSection, schema: heroSchema },
  about: { component: AboutSection, schema: aboutSchema },
  specialties: { component: SpecialtiesSection, schema: specialtiesSchema },
  faq: { component: FaqSection, schema: faqSchema },
  contact: { component: ContactSection, schema: contactSchema },
  // testimonials e map: adicionados na Fase E4
};
