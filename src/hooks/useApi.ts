'use client';

import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Helper interno para chamadas à API do painel.
 */
async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
  return response.json();
}

/**
 * Hook base para busca de dados com refetch.
 */
function useApiData<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!url) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apiFetch<T>(url);
      setState({ data, loading: false, error: null });
    } catch (error) {
      console.error(`Erro ao buscar ${url}:`, error);
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar dados',
      });
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ─── Tipos de domínio ───────────────────────────────────────────

export interface ProfileData {
  displayName: string;
  specialties: string[];
  approaches: string[];
  city: string;
  description: string;
  address: string;
  attendanceType: 'Presencial' | 'Online' | 'Presencial e Online';
  profileImageUrl: string | null;
}

export interface SettingsData {
  whatsappNumber: string;
  instagramHandle: string;
  googleMapsEmbedUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  position: number;
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  source: string;
  consentedAt: string;
  createdAt: string;
}

export interface ThemeData {
  templateId: string;
  tokens: unknown;
  sections: unknown;
}

// ─── Hooks de domínio ───────────────────────────────────────────

interface ProfileResponse {
  profile?: ProfileData;
  settings?: SettingsData;
  tenantSlug?: string;
}

/**
 * Busca perfil e configurações do tenant autenticado.
 * Retorna profile/settings separados + loading/error/refetch.
 */
export function useProfile() {
  const { data, loading, error, refetch } = useApiData<ProfileResponse>('/api/profile');

  return {
    profile: data?.profile ?? null,
    settings: data?.settings ?? null,
    tenantSlug: data?.tenantSlug ?? null,
    loading,
    error,
    refetch,
  };
}

/**
 * Busca FAQs do tenant autenticado.
 */
export function useFaqs() {
  const { data, loading, error, refetch } = useApiData<{ faqs?: FaqItem[] }>('/api/faq');

  return {
    faqs: data?.faqs ?? [],
    loading,
    error,
    refetch,
  };
}

/**
 * Busca leads do tenant autenticado, com filtro opcional por período.
 */
export function useLeads(filters?: { startDate?: string; endDate?: string }) {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  const query = params.toString();

  const { data, loading, error, refetch } = useApiData<{ leads?: LeadItem[] }>(
    `/api/lead${query ? `?${query}` : ''}`
  );

  return {
    leads: data?.leads ?? [],
    loading,
    error,
    refetch,
  };
}

/**
 * Busca o tema publicado e o rascunho do tenant autenticado.
 */
export function useTheme() {
  const { data, loading, error, refetch } = useApiData<{
    theme?: ThemeData;
    draft?: ThemeData | null;
  }>('/api/theme');

  return {
    theme: data?.theme ?? null,
    draft: data?.draft ?? null,
    loading,
    error,
    refetch,
  };
}
