import { ComponentType } from 'react';
import { SectionProps, SectionSchema } from '../types';
import { SectionType } from '../themes/tokens';

import { HeroSection } from './hero/HeroSection';
import { heroSchema } from './hero/schema';
import { AboutSection } from './about/AboutSection';
import { aboutSchema } from './about/schema';
import { SpecialtiesSection } from './specialties/SpecialtiesSection';
import { specialtiesSchema } from './specialties/schema';
import { TestimonialsSection } from './testimonials/TestimonialsSection';
import { testimonialsSchema } from './testimonials/schema';
import { FaqSection } from './faq/FaqSection';
import { faqSchema } from './faq/schema';
import { MapSection } from './map/MapSection';
import { mapSchema } from './map/schema';
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
  testimonials: { component: TestimonialsSection, schema: testimonialsSchema },
  faq: { component: FaqSection, schema: faqSchema },
  map: { component: MapSection, schema: mapSchema },
  contact: { component: ContactSection, schema: contactSchema },
};
