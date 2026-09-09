# Plano — Edição Direta no Template (Inline Editor)

> Documento criado em 07/09/2026. Define a próxima evolução do editor:
> deixar de depender de painéis laterais com menus e permitir que o
> psicólogo edite o conteúdo diretamente sobre o template.

## 1. O que mudou na visão

A versão atual do editor usa click-to-select + painel lateral (modelo
Shopify Customizer). A direção agora é mais próxima de Canva, Notion e
Squarespace Fluid: o usuário **clica no texto, na imagem ou no botão e
edita ali mesmo**, com o mínimo de contexto possível entre o olho e a
ferramenta.

## 2. Pesquisa resumida

### 2.1 Onde editores modernos convergem

| Padrão | Quando usar | Exemplos |
|--------|-------------|----------|
| **Inline editing** | Texto curto, títulos, botões, subtítulos — o usuário vê o resultado final enquanto digita. | Canva, Notion, D24, Avago |
| **Popover / balão flutuante** | Formatação rápida (negrito, cor, alinhamento) sem afastar o olhar. | Notion, Medium, Figma |
| **Bottom sheet (mobile)** | Controles contextuais de várias opções, ações de imagem, estilos. É o padrão dominante no celular porque fica no alcance do polegar. | iOS, Android, Canva mobile |
| **Modal / tela cheia** | Tarefas multi-passos, formulários longos, cortar imagem, seleção de template. | Squarespace, Shopify, Framer |
| **Sidebar / dock flutuante** | Controles globais de design (cores, tipografia, lista de seções) que ficam sempre disponíveis. | Webflow, Framer, Figma |

### 2.2 Aprendizados chave

- **Edição inline converte melhor** porque não quebra o fluxo visual. Cada
  clique a mais (abrir painel, fechar painel) aumenta abandono, especialmente
  no mobile (Fonte: Froala, NN/g).
- **Modais devem ser a última opção** — só para tarefas complexas ou
  multi-passos. Tudo que é 1 campo ou 1 escolha deve ser inline, popover ou
  bottom sheet.
- **No celular, a tela é pequena demais para sidebars**. A melhor prática é
  bottom sheet para controles, modal tela cheia para edição pesada e inline
  para texto simples.
- **Cores e layout são decisões globais**, portanto vivem em um painel
  separado, mas acessível por um botão flutuante tipo “Personalizar” ou
  “Design”, nunca escondidas em 3 menus.

## 3. UX proposta para o Acolha

### 3.1 Modos de interação

#### A. Editar texto — inline

- **Clique/duplo-clique** em um título, parágrafo ou botão ativa
  `contentEditable` naquele elemento.
- O cursor aparece e o usuário digita diretamente no visual.
- Ao sair (`onBlur`) ou pressionar `Enter` (para títulos) o valor salva no
  `draft`.
- Um balão/flutuante pequeno aparece acima do texto com:
  - Negrito / Itálico (se permitido pelo template)
  - Alinhamento (esquerda, centro, direita)
  - Cor do texto (se a seção permitir override)

#### B. Trocar imagem — popover / bottom sheet

- **Clique na imagem** abre um pequeno popover com 3 ações:
  - Trocar imagem (abre modal de upload/crop)
  - Remover foto
  - Ajustar posição (se houver)
- No mobile vira **bottom sheet** com as mesmas ações.

#### C. Listas e chips — inline + modal leve

- Especialidades, abordagens, depoimentos e FAQ continuam podendo ser
  adicionados inline (chip + input dentro da seção).
- Para um depoimento com nome, texto e foto, clica no item → abre
  **bottom sheet** com campos, já que são múltiplos.

#### D. Seções — hover para ações estruturais

- **Hover (desktop) ou toque longo (mobile)** na seção exibe uma pequena
  barra de ações:
  - Ocultar / mostrar
  - Mover para cima / baixo
  - Trocar layout (se a seção tiver variantes)
  - Remover
- **Botão flutuante “+ Seção”** abre um modal de catálogo.

### 3.2 Cores, tipografia e templates — botão “Personalizar”

A barra do editor ganha um botão fixo chamado **“Personalizar”** (ou
ícone de pincel). Ao clicar:

- **Desktop:** abre um painel deslizante pela direita, flutuante, com abas:
  - **Cores** (tokens: primary, accent, background, surface, text, muted)
  - **Tipografia** (fonte do título, peso, tamanho base)
  - **Formato da página** (borda, sombra, espaçamento)
  - **Meu site** (slug, domínio, página publicada)
- **Mobile:** vira **bottom sheet** de abas ou **tela cheia** com bottom
  navigation.

A escolha de **template** (Noite, Acolhimento, Sereno etc.) entra no topo
 desse painel como um carrossel de miniaturas.

### 3.3 Comandos rápidos globais

Barra superior do editor (desktop e mobile):

- ↩ / ↪ (undo/redo)
- Pincel → abre “Personalizar”
- Desktop / Tablet / Celular (device preview)
- “Salvar rascunho”
- “Publicar”

No mobile a barra reduz para: voltar, undo/redo, pincel, publicar.

## 4. Arquitetura técnica proposta

### 4.1 Ativação do modo edição

O `SiteRenderer` já suporta `editable` e `onSelectSection`. Será estendido
com:

```
SiteRenderer
  ├── EditableText (contentEditable)
  ├── EditableImage (popover/bottom sheet)
  ├── EditableList (chips + modal)
  ├── EditableButton (popover)
  └── EditableSection (hover toolbar)
```

Cada componente sabe ler seu campo no `SiteData` (fonte: `profile.city`,
`settings.whatsapp`, etc.) e aciona `onUpdateContent(path, value)`.

### 4.2 Novo `useInlineEditor` hook

Responsável por:

- Ativar/desativar `contentEditable`
- Salvar no rascunho com debounce
- Gerenciar seleção/foco
- Disparar popovers e bottom sheets conforme o tipo do elemento

### 4.3 Popover / Bottom Sheet / Modal

Criar 3 componentes reutilizáveis baseados em `<dialog>`:

| Componente | Uso |
|------------|-----|
| `InlinePopover` | Formatação de texto, mini ações de imagem |
| `BottomSheet` | Controles com múltiplas opções no mobile |
| `EditorModal` | Upload de imagem, catálogo de seções, configurações |

### 4.4 Onde fica cada tipo de dado

| Dado | Como editar |
|------|-------------|
| Nome / descrição / cidade / endereço | Inline na seção correspondente |
| Especialidades / abordagens | Chips inline + botão “+” |
| Foto de perfil / imagens | Click na imagem → popover → upload |
| Cor de fundo / fonte / botões | Painel “Personalizar” |
| Ordem de seções | Hover / toque longo → setas |
| Adicionar/remover seção | Botão flutuante “+ Seção” → modal |
| Trocar template | Carrossel no topo do “Personalizar” |

## 5. Implementação em fases

### Fase 1: Fundação (estimativa: 6-8h)

1. Criar `InlineText` com `contentEditable` e `onBlur` → salvar no draft.
2. Criar `InlinePopover` para formatação básica.
3. Trocar `SectionInspector` de painel lateral para popover/balão.
4. Testar no Hero: nome, descrição, botão CTA.

### Fase 2: Mídia e listas (6-8h)

1. `EditableImage` com popover → abre modal de upload.
2. Chips inline para especialidades e abordagens.
3. Depoimentos e FAQ em bottom sheet (mobile) / modal (desktop).

### Fase 3: Controles estruturais (6-8h)

1. Hover toolbar nas seções: ocultar, mover, remover, trocar variante.
2. Botão “+ Seção” flutuante.
3. Catálogo de seções em modal.

### Fase 4: Painel “Personalizar” e templates (6-8h)

1. Botão “Personalizar” na topbar.
2. Painel flutuante com abas: Cores, Tipografia, Formato, Meu site.
3. Carrossel de templates no topo do painel.

### Fase 5: Mobile-first e polimento (6-8h)

1. Bottom sheets para tudo que é popover em mobile.
2. Tooltips / atalhos.
3. Acessibilidade: foco, aria, anúncios de mudança.

**Total estimado: 30-40h**

## 6. Decisões pendentes (para validar com usuário)

1. O usuário pode arrastar seções (drag-and-drop) ou prefere setas?
2. O texto pode ter formatação rica (negrito/itálico) ou deve ser sempre
   texto simples para manter identidade?
3. Cores: o usuário pode trocar qualquer cor livremente ou só escolher
   presets da marca?
4. O painel “Personalizar” abre na direita (desktop) ou embaixo
   (mobile)? Ambas são viáveis.
