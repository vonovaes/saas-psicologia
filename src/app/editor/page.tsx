'use client';

import { EditorShell } from '@/components/features/editor/EditorShell';
import { useProfile, useFaqs, useTheme } from '@/hooks/useApi';
import { TenantThemeData } from '@/landing/themes/tokens';
import { SiteData } from '@/landing/types';

export default function EditorPage() {
  const { profile, settings, loading: profileLoading } = useProfile();
  const { faqs, loading: faqsLoading } = useFaqs();
  const { theme, loading: themeLoading } = useTheme();

  const loading = profileLoading || faqsLoading || themeLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando editor...</div>
      </div>
    );
  }

  const baseData: SiteData = {
    profile: profile ? { ...profile, address: profile.address ?? '' } : null,
    settings: settings ?? null,
    faqs: faqs ?? [],
  };

  return (
    <EditorShell
      baseData={baseData}
      initialTheme={theme as TenantThemeData | null}
    />
  );
}
