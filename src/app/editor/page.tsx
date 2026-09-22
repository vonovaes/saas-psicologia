'use client';

import { EditorShell } from '@/components/features/editor/EditorShell';
import { useProfile, useFaqs, useTheme } from '@/hooks/useApi';
import { TenantThemeData, DEFAULT_TOKENS } from '@/landing/themes/tokens';
import { SiteData } from '@/landing/types';

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) =>
    deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
  );
}

export default function EditorPage() {
  const { profile, settings, tenantSlug, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { faqs, loading: faqsLoading, refetch: refetchFaqs } = useFaqs();
  const { theme, draft, loading: themeLoading, refetch: refetchTheme } = useTheme();

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
  // Mescla apenas chaves definidas do draft — um draft antigo sem `sections`,
  // por exemplo, não deve apagar as seções publicadas.
  const published = theme as TenantThemeData | null;
  let initialTheme = published;
  let draftThemeDiffers = false;
  if (draft) {
    const merged = { ...(published ?? {}) } as Record<string, unknown>;
    for (const [key, value] of Object.entries(draft)) {
      if (value !== undefined && key !== 'contentEdits') merged[key] = value;
    }
    merged.tokens = {
      ...(published?.tokens ?? DEFAULT_TOKENS),
      ...((draft.tokens as object | undefined) ?? {}),
    };
    initialTheme = merged as unknown as TenantThemeData;

    // Compara o tema resultante do merge com o publicado — se iguais,
    // o rascunho nao representa alteracao pendente.
    draftThemeDiffers =
      !published ||
      merged.templateId !== published.templateId ||
      !deepEqual(merged.tokens, published.tokens) ||
      !deepEqual(merged.sections, published.sections);
  }

  // Reconcilia edições do draft com os dados publicados:
  // - null só se mantém quando a base também é null/undefined (evita que
  //   null de draft esconda dado publicado, ex: imagem removida no servidor)
  // - edições iguais ao valor publicado são descartadas (ex: draft
  //   "ressuscitado" por um autosave tardio depois do publish)
  const draftEdits = (draft as { contentEdits?: Record<string, unknown> } | null)?.contentEdits ?? {};
  const initialContentEdits: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(draftEdits)) {
    const baseValue = getByPath(baseData as unknown as Record<string, unknown>, path);
    if (value === null) {
      if (baseValue === null || baseValue === undefined) initialContentEdits[path] = value;
    } else if (!deepEqual(value, baseValue)) {
      initialContentEdits[path] = value;
    }
  }

  const initialDirty =
    Object.keys(initialContentEdits).length > 0 || draftThemeDiffers;

  return (
    <EditorShell
      baseData={baseData}
      initialTheme={initialTheme}
      initialContentEdits={initialContentEdits}
      initialDirty={initialDirty}
      publicSlug={tenantSlug}
      onRefreshData={async () => {
        await Promise.all([refetchProfile(), refetchFaqs(), refetchTheme()]);
      }}
    />
  );
}
