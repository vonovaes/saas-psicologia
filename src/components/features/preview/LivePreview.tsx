'use client';

import { SiteRenderer } from '@/landing/SiteRenderer';
import { SiteData } from '@/landing/types';
import { TenantThemeData } from '@/landing/themes/tokens';

interface LivePreviewProps {
  profile: SiteData['profile'];
  settings: SiteData['settings'];
  faqs: SiteData['faqs'];
  theme?: TenantThemeData;
}

/**
 * Preview da landing page dentro do editor. Usa o mesmo
 * SiteRenderer da landing pública — zero duplicação de markup.
 */
export function LivePreview({ profile, settings, faqs, theme }: LivePreviewProps) {
  return (
    <div>
      {/* Preview Indicator */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 sticky top-0 z-50 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-xs text-amber-400 font-medium">
            MODO PREVIEW - Alterações em tempo real
          </p>
        </div>
      </div>

      <SiteRenderer
        data={{ profile, settings, faqs }}
        theme={theme}
      />
    </div>
  );
}
