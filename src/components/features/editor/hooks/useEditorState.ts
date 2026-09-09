'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  TenantThemeData,
  SectionConfig,
  SectionType,
  ThemeTokens,
  DEFAULT_THEME,
} from '@/landing/themes/tokens';
import { SiteData } from '@/landing/types';
import { useRef } from 'react';

interface HistoryEntry {
  theme: TenantThemeData;
  contentEdits: Record<string, unknown>;
}

/**
 * Estado completo do editor visual.
 * - theme: templateId + tokens + sections (draft em memória)
 * - contentEdits: edições de conteúdo mapeadas por "source" (ex: profile.displayName)
 *   que são aplicadas ao SiteData no preview e persistidas via /api/profile ao publicar.
 */
export interface EditorState {
  theme: TenantThemeData;
  contentEdits: Record<string, unknown>;
  isDirty: boolean;
  saving: boolean;
  publishing: boolean;
  lastSavedAt: Date | null;
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function setByPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');
  const clone = { ...obj };
  let cursor: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = { ...(cursor[keys[i]] as Record<string, unknown> | undefined) };
    cursor = cursor[keys[i]] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return clone;
}

export function useEditorState(initialTheme: TenantThemeData | null, initialContentEdits: Record<string, unknown> = {}) {
  const [theme, setTheme] = useState<TenantThemeData>(initialTheme ?? DEFAULT_THEME);
  const [contentEdits, setContentEdits] = useState<Record<string, unknown>>(initialContentEdits);
  const [isDirty, setIsDirty] = useState(Object.keys(initialContentEdits).length > 0);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // ── Undo/Redo ─────────────────────────────────────────────────
  const pastRef = useRef<HistoryEntry[]>([]);
  const futureRef = useRef<HistoryEntry[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const themeRef = useRef(theme);
  const editsRef = useRef(contentEdits);
  themeRef.current = theme;
  editsRef.current = contentEdits;

  const pushHistory = useCallback(() => {
    pastRef.current.push({ theme: themeRef.current, contentEdits: editsRef.current });
    if (pastRef.current.length > 50) pastRef.current.shift();
    futureRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const undo = useCallback(() => {
    const prev = pastRef.current.pop();
    if (!prev) return;
    futureRef.current.push({ theme: themeRef.current, contentEdits: editsRef.current });
    setTheme(prev.theme);
    setContentEdits(prev.contentEdits);
    setIsDirty(true);
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(true);
  }, []);

  const redo = useCallback(() => {
    const next = futureRef.current.pop();
    if (!next) return;
    pastRef.current.push({ theme: themeRef.current, contentEdits: editsRef.current });
    setTheme(next.theme);
    setContentEdits(next.contentEdits);
    setIsDirty(true);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  // ── Tokens ────────────────────────────────────────────────────

  const updateTokens = useCallback((patch: Partial<ThemeTokens>) => {
    setTheme((prev) => ({ ...prev, tokens: { ...prev.tokens, ...patch } }));
    pushHistory();
    setIsDirty(true);
  }, []);

  const updateColors = useCallback((colors: Partial<ThemeTokens['colors']>) => {
    setTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        colors: { ...prev.tokens.colors, ...colors },
      },
    }));
    pushHistory();
    setIsDirty(true);
  }, []);

  // ── Seções ────────────────────────────────────────────────────

  const updateSection = useCallback((index: number, patch: Partial<SectionConfig>) => {
    setTheme((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
    pushHistory();
    setIsDirty(true);
  }, []);

  const updateSectionOverride = useCallback((index: number, key: string, value: unknown) => {
    setTheme((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === index ? { ...s, overrides: { ...s.overrides, [key]: value } } : s
      ),
    }));
    pushHistory();
    setIsDirty(true);
  }, []);

  const applyTemplate = useCallback((template: TenantThemeData) => {
    setTheme(template);
    pushHistory();
    setIsDirty(true);
  }, []);

  const addSection = useCallback((type: SectionType, variant: string) => {
    setTheme((prev) => {
      const newSection: SectionConfig = {
        type,
        variant,
        visible: true,
        order: prev.sections.length,
        overrides: {},
      };
      return { ...prev, sections: [...prev.sections, newSection] };
    });
    pushHistory();
    setIsDirty(true);
  }, []);

  const removeSection = useCallback((index: number) => {
    setTheme((prev) => {
      const remaining = prev.sections.filter((_, i) => i !== index);
      const reordered = [...remaining]
        .sort((a, b) => a.order - b.order)
        .map((s, i) => ({ ...s, order: i }));
      return { ...prev, sections: reordered };
    });
    pushHistory();
    setIsDirty(true);
  }, []);

  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    setTheme((prev) => {
      const sorted = [...prev.sections].sort((a, b) => a.order - b.order);
      const section = prev.sections[index];
      const sortedPos = sorted.indexOf(section);
      const target = direction === 'up' ? sortedPos - 1 : sortedPos + 1;
      if (target < 0 || target >= sorted.length) return prev;
      const swapped = [...sorted];
      [swapped[sortedPos], swapped[target]] = [swapped[target], swapped[sortedPos]];
      return {
        ...prev,
        sections: swapped.map((s, i) => ({ ...s, order: i })),
      };
    });
    pushHistory();
    setIsDirty(true);
  }, []);

  const reorderSections = useCallback((from: number, to: number) => {
    setTheme((prev) => {
      const sorted = [...prev.sections].sort((a, b) => a.order - b.order);
      if (from === to || from < 0 || from >= sorted.length || to < 0 || to > sorted.length) return prev;
      const moved = sorted.splice(from, 1)[0];
      sorted.splice(Math.min(to, sorted.length), 0, moved);
      return {
        ...prev,
        sections: sorted.map((s, i) => ({ ...s, order: i })),
      };
    });
    pushHistory();
    setIsDirty(true);
  }, []);

  // ── Conteúdo (campos com source) ──────────────────────────────

  const updateContent = useCallback((source: string, value: unknown) => {
    setContentEdits((prev) => ({ ...prev, [source]: value }));
    pushHistory();
    setIsDirty(true);
  }, []);

  /**
   * Retorna o SiteData com as edições de conteúdo aplicadas — para o preview.
   */
  const getPreviewData = useCallback(
    (base: SiteData): SiteData => {
      let merged: SiteData = {
        profile: base.profile ? { ...base.profile } : null,
        settings: base.settings ? { ...base.settings } : null,
        faqs: base.faqs,
      };
      for (const [path, value] of Object.entries(contentEdits)) {
        if (path.startsWith('profile.') && merged.profile) {
          merged.profile = setByPath(merged.profile as unknown as Record<string, unknown>, path.replace('profile.', ''), value) as unknown as SiteData['profile'];
        } else if (path.startsWith('settings.') && merged.settings) {
          merged.settings = setByPath(merged.settings as unknown as Record<string, unknown>, path.replace('settings.', ''), value) as unknown as SiteData['settings'];
        } else if (path === 'faqs') {
          merged.faqs = value as SiteData['faqs'];
        }
      }
      return merged;
    },
    [contentEdits]
  );

  const getFieldValue = useCallback(
    (base: SiteData, source: string | undefined, overrideValue: unknown): unknown => {
      if (overrideValue !== undefined) return overrideValue;
      if (!source) return undefined;
      const edited = contentEdits[source];
      if (edited !== undefined) return edited;
      return getByPath(base as unknown as Record<string, unknown>, source);
    },
    [contentEdits]
  );

  // ── Persistência ──────────────────────────────────────────────

  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'draft',
          draft: { ...theme },
        }),
      });
      if (!response.ok) throw new Error('Failed to save draft');
      setLastSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }, [theme]);

  const publish = useCallback(async () => {
    setPublishing(true);
    try {
      // 1) Persiste edições de conteúdo nas entidades de origem
      const profilePatch: Record<string, unknown> = {};
      const settingsPatch: Record<string, unknown> = {};
      for (const [path, value] of Object.entries(contentEdits)) {
        if (path.startsWith('profile.')) profilePatch[path.replace('profile.', '')] = value;
        if (path.startsWith('settings.')) settingsPatch[path.replace('settings.', '')] = value;
      }
      if (Object.keys(profilePatch).length || Object.keys(settingsPatch).length) {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(Object.keys(profilePatch).length ? { profile: profilePatch } : {}),
            ...(Object.keys(settingsPatch).length ? { settings: settingsPatch } : {}),
          }),
        });
        if (!res.ok) throw new Error('Failed to save content');
      }

      // 2) Publica o tema
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', theme }),
      });
      if (!res.ok) throw new Error('Failed to publish theme');

      setLastSavedAt(new Date());
      return true;
    } finally {
      setPublishing(false);
    }
  }, [theme, contentEdits]);

  const clearContentEdits = useCallback(() => {
    setContentEdits({});
    setIsDirty(false);
  }, []);

  return useMemo(
    () => ({
      theme,
      contentEdits,
      isDirty,
      saving,
      publishing,
      lastSavedAt,
      updateTokens,
      updateColors,
      updateSection,
      updateSectionOverride,
      updateContent,
      applyTemplate,
      addSection,
      removeSection,
      moveSection,
      reorderSections,
      getPreviewData,
      getFieldValue,
      saveDraft,
      publish,
      clearContentEdits,
      setTheme,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [
      theme, contentEdits, isDirty, saving, publishing, lastSavedAt,
      updateTokens, updateColors, updateSection, updateSectionOverride,
      updateContent, applyTemplate, addSection, removeSection, moveSection, reorderSections,
      getPreviewData, getFieldValue, saveDraft, publish, clearContentEdits, undo, redo, canUndo, canRedo,
    ]
  );
}
