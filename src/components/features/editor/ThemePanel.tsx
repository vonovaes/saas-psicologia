'use client';

import { ThemeTokens } from '@/landing/themes/tokens';
import { TEMPLATES } from '@/landing/themes/presets';
import { TenantThemeData } from '@/landing/themes/tokens';
import { ColorField, SelectField } from './fields';

interface ThemePanelProps {
  theme: TenantThemeData;
  onUpdateColors: (colors: Partial<ThemeTokens['colors']>) => void;
  onUpdateTokens: (tokens: Partial<ThemeTokens>) => void;
  onApplyTemplate: (template: TenantThemeData) => void;
}

const COLOR_LABELS: Record<keyof ThemeTokens['colors'], string> = {
  primary: 'Cor principal',
  accent: 'Cor de destaque',
  surface: 'Superfície (cards)',
  background: 'Fundo da página',
  text: 'Texto',
  textMuted: 'Texto secundário',
};

/**
 * Painel de design: cores, tipografia, forma e troca de template.
 * Alterações refletem imediatamente no canvas via CSS vars.
 */
export function ThemePanel({ theme, onUpdateColors, onUpdateTokens, onApplyTemplate }: ThemePanelProps) {
  const { colors, typography, shape } = theme.tokens;

  return (
    <div className="space-y-6">
      {/* Troca de template */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Template</h3>
        <div className="grid grid-cols-1 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onApplyTemplate(t.preset)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                theme.templateId === t.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span
                className="w-8 h-8 rounded-full shrink-0 border"
                style={{ backgroundColor: t.swatch.bg, borderColor: t.swatch.primary }}
              >
                <span
                  className="block w-3 h-3 rounded-full mx-auto mt-2"
                  style={{ backgroundColor: t.swatch.primary }}
                />
              </span>
              <span>
                <span className="block text-sm font-medium text-gray-900">{t.name}</span>
                <span className="block text-xs text-gray-500">{t.mood}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cores */}
      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Cores</h3>
        {(Object.keys(COLOR_LABELS) as (keyof ThemeTokens['colors'])[]).map((key) => (
          <ColorField
            key={key}
            field={{ id: key, type: 'color', label: COLOR_LABELS[key] }}
            value={colors[key]}
            onChange={(v) => onUpdateColors({ [key]: v })}
          />
        ))}
      </div>

      {/* Tipografia */}
      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Tipografia</h3>
        <SelectField
          field={{
            id: 'headingFont', type: 'select', label: 'Fonte dos títulos',
            options: [
              { value: 'sans', label: 'Sem serifa' },
              { value: 'serif', label: 'Serifada' },
              { value: 'display', label: 'Display' },
            ],
          }}
          value={typography.headingFont}
          onChange={(v) => onUpdateTokens({ typography: { ...typography, headingFont: v as ThemeTokens['typography']['headingFont'] } })}
        />
        <SelectField
          field={{
            id: 'headingWeight', type: 'select', label: 'Peso dos títulos',
            options: [
              { value: 'light', label: 'Leve' },
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Negrito' },
            ],
          }}
          value={typography.headingWeight}
          onChange={(v) => onUpdateTokens({ typography: { ...typography, headingWeight: v as ThemeTokens['typography']['headingWeight'] } })}
        />
        <SelectField
          field={{
            id: 'scale', type: 'select', label: 'Espaçamento',
            options: [
              { value: 'compact', label: 'Compacto' },
              { value: 'normal', label: 'Normal' },
              { value: 'spacious', label: 'Espaçoso' },
            ],
          }}
          value={typography.scale}
          onChange={(v) => onUpdateTokens({ typography: { ...typography, scale: v as ThemeTokens['typography']['scale'] } })}
        />
      </div>

      {/* Forma */}
      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Forma</h3>
        <SelectField
          field={{
            id: 'radius', type: 'select', label: 'Arredondamento',
            options: [
              { value: 'none', label: 'Reto' },
              { value: 'sm', label: 'Sutil' },
              { value: 'md', label: 'Médio' },
              { value: 'lg', label: 'Arredondado' },
              { value: 'full', label: 'Totalmente redondo' },
            ],
          }}
          value={shape.radius}
          onChange={(v) => onUpdateTokens({ shape: { ...shape, radius: v as ThemeTokens['shape']['radius'] } })}
        />
        <SelectField
          field={{
            id: 'cardStyle', type: 'select', label: 'Estilo dos cards',
            options: [
              { value: 'flat', label: 'Plano' },
              { value: 'bordered', label: 'Com borda' },
              { value: 'glass', label: 'Vidro' },
              { value: 'elevated', label: 'Elevado' },
            ],
          }}
          value={shape.cardStyle}
          onChange={(v) => onUpdateTokens({ shape: { ...shape, cardStyle: v as ThemeTokens['shape']['cardStyle'] } })}
        />
      </div>
    </div>
  );
}
