# Plano de Desenvolvimento — Editor Visual de Templates

> Documento criado em 05/09/2026. Define a nova direção de UX do produto:
> sair do modelo "formulário + preview" para "templates + edição visual direta"
> (modelo Shopify Customizer adaptado).

## Visão

O psicólogo escolhe um template pronto e edita a página real diretamente:
clica numa seção → painel contextual mostra só as configurações daquela seção.
Sem drag-and-drop livre (evita quebrar o design). Modelo draft/publish:
o usuário edita um rascunho e publica quando estiver pronto.

## Princípios de UX adotados

1. **Edição estruturada, não livre** — baseado no modelo Shopify/Squarespace.
   Usuários não-designers produzem melhor resultado com layout restrito.
2. **Templates resolvem 70-80%** — o usuário só troca conteúdo e cores.
3. **Design tokens, não cores soltas** — papéis de cor (primary, accent,
   surface, background, text, textMuted) aplicados via CSS variables.
4. **Um único renderizador** — `SiteRenderer` serve a landing pública E o
   editor (elimina a duplicação LivePreview vs TenantLandingPage).
5. **Preview Inspector** — clicar no elemento abre suas configurações.

## Arquitetura-alvo

### Modelo de dados

```prisma
model TenantTheme {
  id          String    @id @default(cuid())
  tenantId    String    @unique
  templateId  String    @default("noite")
  tokens      Json      // colors, typography, shape
  sections    Json      // [{ type, variant, visible, order, overrides }]
  draft       Json?     // rascunho vs publicado
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}
```

### Section Registry (inspirado no Shopify `{% schema %}`)

Cada seção é auto-descritiva: o editor gera o painel a partir do schema.

```typescript
// src/landing/sections/hero/schema.ts
export const heroSchema = {
  type: 'hero',
  name: 'Cabeçalho Principal',
  variants: ['split', 'centered', 'minimal'],
  settings: [
    { id: 'displayName', type: 'text', label: 'Nome', source: 'profile.displayName' },
    { id: 'photo', type: 'image', label: 'Foto', source: 'profile.profileImageUrl' },
    { id: 'ctaText', type: 'text', label: 'Texto do botão', default: 'Agendar Consulta' },
  ],
};
```

### Design Tokens

```typescript
interface ThemeTokens {
  colors: {
    primary: string; accent: string; surface: string;
    background: string; text: string; textMuted: string;
  };
  typography: {
    headingFont: 'sans' | 'serif' | 'display';
    headingWeight: 'light' | 'normal' | 'bold';
    scale: 'compact' | 'normal' | 'spacious';
  };
  shape: {
    radius: 'none' | 'sm' | 'md' | 'full';
    cardStyle: 'flat' | 'bordered' | 'glass' | 'elevated';
  };
}
```

Tokens aplicados via CSS variables (`--color-primary` etc). Trocar tema =
trocar as variáveis = página inteira muda.

### Estrutura de arquivos

```
src/
├── landing/                              # motor do site público
│   ├── sections/
│   │   ├── hero/{HeroSection.tsx, variants/, schema.ts}
│   │   ├── about/ specialties/ faq/ contact/ map/
│   │   ├── testimonials/                 # seção nova
│   │   └── index.ts                      # SECTION_REGISTRY
│   ├── themes/
│   │   ├── tokens.ts                     # tipos + defaults
│   │   ├── presets/{noite,acolhimento,sereno,essencial,vital}.ts
│   │   └── ThemeProvider.tsx             # injeta CSS variables
│   └── SiteRenderer.tsx                  # renderiza sections[] do tema
│
├── components/features/editor/
│   ├── EditorShell.tsx                   # toolbar + canvas + inspector
│   ├── EditorCanvas.tsx                  # SiteRenderer em modo edição
│   ├── EditorToolbar.tsx                 # device toggle, undo, publicar
│   ├── SectionInspector.tsx              # painel contextual schema-driven
│   ├── ThemePanel.tsx                    # cores, fontes, template
│   ├── SectionList.tsx                   # adicionar/remover/reordenar
│   ├── fields/                           # TextField, ImageField,
│   │                                     # ColorField, SelectField, ListField
│   └── hooks/{useEditorState.ts, useEditorHistory.ts}
│
├── app/editor/page.tsx                   # nova rota principal
└── app/api/theme/route.ts                # GET/PUT do TenantTheme
```

## Os 5 Templates

### 1. "Noite" — Premium Dark (visual atual, refatorado)
- **Persona:** profissional sofisticado, urbano
- **Tokens:** bg `#0a0b0c`, surface `#1a1b1e`, primary `amber-500`,
  cards glass, radius lg
- **Seções:** hero-split, about, specialties-cards, faq, contact, footer
- **Mood:** elegante, noturno, exclusivo

### 2. "Acolhimento" — Quente e Humano
- **Persona:** terapia humanista, acolhedora
- **Tokens:** bg `#faf7f2`, primary `#b45309` (terracota),
  accent `#78716c`, serif headings, radius full, cards elevated
- **Seções:** hero-centered (foto grande), about editorial,
  specialties-list, testimonials, contact, footer
- **Mood:** caloroso, próximo, orgânico

### 3. "Sereno" — Clínico e Calmo
- **Persona:** TCC, neuropsicologia, abordagem técnica
- **Tokens:** bg `#ffffff`, primary `#0d9488` (teal), surface `#f0fdfa`,
  radius md, cards bordered
- **Seções:** hero-split minimal, specialties-grid, about, faq, map,
  contact, footer
- **Mood:** confiança, clareza, leveza

### 4. "Essencial" — Minimalista Editorial
- **Persona:** psicanálise, perfil intelectual
- **Tokens:** bg `#ffffff`, text/primary `#111111` (mono),
  serif display, radius none, cards flat com divisores
- **Seções:** hero-minimal (tipográfico), about editorial,
  specialties-list tipográfica, contact, footer slim
- **Mood:** sofisticado, editorial, atemporal

### 5. "Vital" — Natureza e Bem-estar
- **Persona:** terapias integrativas, corpo + mente
- **Tokens:** bg `#f7f9f4`, primary `#4d7c0f` (verde oliva),
  accent `#a3b18a`, radius lg, cards elevated
- **Seções:** hero-split, about, specialties-cards, testimonials,
  contact, footer
- **Mood:** vitalidade, equilíbrio, natural

## Pirâmide de componentização (boas práticas)

```
NÍVEL 4 — Páginas: só orquestram
NÍVEL 3 — Features: módulos de negócio (editor/*, sections/*)
NÍVEL 2 — Blocos: seções da landing com schema + variants
NÍVEL 1 — Primitivos: ui/*, fields/* (puros, sem estado)
```

Regra: dados descem por props, eventos sobem por callbacks.
Nenhuma seção faz fetch — o renderer injeta os dados.

## Roadmap

| Fase | Escopo | Estimativa |
|------|--------|-----------|
| E-1 Higiene Frontend | AdminLayout, custom hooks, design tokens em CSS vars | 4-6h |
| E0 Fundação de Tema | Migration TenantTheme + DTO + service + /api/theme + ThemeProvider | 6-8h |
| E1 Modularização | Quebrar TenantLandingPage em seções com schema + SiteRenderer | 10-12h |
| E2 Templates | 5 presets + variants (hero×3, specialties×3, about×2) + galeria | 6-8h |
| E3 Editor Visual | EditorShell + click-to-select + inspector + ThemePanel + draft/publish | 12-16h |
| E4 Seções/Listas | Reordenação, ListField (specialties/FAQ no editor), Depoimentos, Mapa | 6-8h |
| E5 Polish | Undo/redo, autosave, device preview, a11y, retirar /profile antigo | 6-8h |
| **Total** | | **50-66h** |

## Estratégia de migração

1. Temas/seções convivem com a landing atual
2. `/api/public/data` passa a retornar `theme` → SiteRenderer renderiza com
   tema; fallback para visual atual se não houver tema
3. Tenants existentes migram para "Noite" (dados idênticos, zero quebra)
4. `/editor` entra como página nova; `/profile` permanece até validação

## Decisões registradas

- Sem microfrontends (overengineering para time solo/deploy único)
- Sem drag-and-drop livre (reordenação só via lista lateral)
- Edição via click → inspector (não contentEditable na primeira versão)
- Draft/publish para nunca quebrar o site ao vivo
