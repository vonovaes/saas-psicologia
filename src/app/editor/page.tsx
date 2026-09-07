'use client';

import { EditorShell } from '@/components/features/editor/EditorShell';
import { useProfile, useFaqs, useTheme } from '@/hooks/useApi';
import { TenantThemeData } from '@/landing/themes/tokens';
import { SiteData } from '@/landing/types';

export default function EditorPage() {
  const { profile, settings, tenantSlug, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { faqs, loading: faqsLoading, refetch: refetchFaqs } = useFaqs();
  const { theme, draft, loading: themeLoading } = useTheme();

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

  // Se há rascunho salvo, o editor abre com ele; senão, com o tema publicado.
  const published = theme as TenantThemeData | null;
  const initialTheme = draft
    ? ({
        ...published,
        ...draft,
        tokens: { ...(published?.tokens as object), ...(draft.tokens as object) },
      } as unknown as TenantThemeData)
    : published;
  const initialContentEdits =
    (draft && (draft as { contentEdits?: Record<string, unknown> }).contentEdits) ?? {};

  return (
    <EditorShell
      baseData={baseData}
      initialTheme={initialTheme}
      initialContentEdits={initialContentEdits}
      publicSlug={tenantSlug}
      onRefreshData={() => {
        refetchProfile();
        refetchFaqs();
      }}
    />
  );
}
