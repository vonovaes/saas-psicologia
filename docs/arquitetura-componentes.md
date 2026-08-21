# Arquitetura de Componentes UI

## Visão Geral

Este projeto utiliza uma arquitetura de componentes reutilizáveis baseada em padrões modernos de React/Next.js, inspirada em bibliotecas como shadcn/ui e práticas recomendadas pela comunidade.

## Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Componentes genéricos e reutilizáveis
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Button.tsx
│   │   ├── FieldGroup.tsx
│   │   └── index.ts     # Barrel file para exports
│   └── features/        # Componentes específicos de features (futuro)
└── app/
    └── profile/         # Páginas que consomem os componentes
```

## Princípios de Design

### 1. Componentes UI (src/components/ui/)

**Características:**
- Sem lógica de negócio
- Sem chamadas diretas a APIs
- Recebem dados via props
- Altamente reutilizáveis
- Focados em apresentação

**Regra de Ouro:**
> Se um componente aparece em mais de um lugar, ele pertence a `ui/`.

### 2. Componentes de Features (src/components/features/)

**Características:**
- Específicos para um domínio de negócio
- Podem conter lógica de negócio
- Podem fazer chamadas a APIs
- Organizados por feature (ex: auth, profile, dashboard)

### 3. Layout Components (futuro)

**Características:**
- Estrutura compartilhada entre páginas
- Navbar, Footer, PageWrapper
- Não conhecem o conteúdo específico da página

## Componentes Implementados

### Input

```tsx
<Input
  label="Nome"
  value={value}
  onChange={handleChange}
  error={errorMessage}
  placeholder="Digite seu nome"
/>
```

**Props:**
- `label`: Rótulo do campo
- `error`: Mensagem de erro (opcional)
- Todas as props nativas de `<input>`

**Estilos:**
- Fundo branco sólido (`bg-white`)
- Texto preto para legibilidade (`text-gray-900`)
- Placeholder cinza (`placeholder-gray-500`)
- Bordas e focus states consistentes

### Textarea

```tsx
<Textarea
  label="Descrição"
  value={value}
  onChange={handleChange}
  rows={6}
  error={errorMessage}
/>
```

**Props:**
- `label`: Rótulo do campo
- `error`: Mensagem de erro (opcional)
- Todas as props nativas de `<textarea>`

### Select

```tsx
<Select
  label="Tipo"
  value={value}
  onChange={handleChange}
  options={[
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
  ]}
  error={errorMessage}
/>
```

**Props:**
- `label`: Rótulo do campo
- `options`: Array de `{ value, label }`
- `error`: Mensagem de erro (opcional)
- Todas as props nativas de `<select>`

### Button

```tsx
<Button
  variant="primary"
  size="md"
  loading={isLoading}
  disabled={isDisabled}
  onClick={handleClick}
>
  Salvar
</Button>
```

**Props:**
- `variant`: `primary`, `secondary`, `danger`, `outline`
- `size`: `sm`, `md`, `lg`
- `loading`: Mostra spinner de carregamento
- `disabled`: Desabilita o botão
- Todas as props nativas de `<button>`

**Variantes:**
- `primary`: Azul para ações principais
- `secondary`: Cinza para ações secundárias
- `danger`: Vermelho para ações destrutivas
- `outline`: Borda cinza para ações neutras

### FieldGroup

```tsx
<FieldGroup>
  <Input label="Campo 1" />
  <Input label="Campo 2" />
  <Input label="Campo 3" />
</FieldGroup>
```

**Características:**
- Wrapper para agrupar campos de formulário
- Espaçamento consistente (`space-y-6`)
- Facilita organização visual

## Benefícios desta Arquitetura

### 1. Consistência Visual
- Todos os inputs têm o mesmo estilo
- Alterações globais são feitas em um lugar
- Aparência unificada em todo o aplicativo

### 2. Manutenção Simplificada
- Se precisar mudar a cor dos inputs, altere apenas em `Input.tsx`
- Se precisar adicionar validação, adicione ao componente base
- Mudanças se propagam automaticamente

### 3. Desenvolvimento Mais Rápido
- Novas páginas usam componentes prontos
- Menos código repetitivo
- Foco em lógica de negócio, não em estilos

### 4. Type Safety
- TypeScript para todos os componentes
- IntelliSense automático
- Menos bugs em tempo de desenvolvimento

### 5. Acessibilidade
- Labels automáticos
- ARIA attributes incluídos
- Estados de erro visuais

## Exemplo de Uso

### Antes (com código repetitivo):
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Nome
  </label>
  <input
    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
    placeholder="Digite seu nome"
  />
</div>
```

### Depois (com componentes reutilizáveis):
```tsx
<Input
  label="Nome"
  placeholder="Digite seu nome"
/>
```

## Próximos Passos

### Componentes Planejados

1. **Form Components**
   - `Form` - Wrapper de formulário com validação
   - `FormField` - Campo com label e erro integrados
   - `FormError` - Mensagem de erro global

2. **Data Display**
   - `Card` - Container estilizado
   - `Badge` - Tag pequena
   - `Avatar` - Imagem de perfil

3. **Feedback**
   - `Alert` - Mensagens de sucesso/erro
   - `Spinner` - Indicador de carregamento
   - `Tooltip` - Dicas interativas

4. **Navigation**
   - `Navbar` - Barra de navegação
   - `Sidebar` - Menu lateral
   - `Breadcrumbs` - Navegação hierárquica

### Padrões Avançados

1. **Compound Components**
   - Componentes com sub-componentes (ex: `Dialog.Title`, `Dialog.Content`)
   - Composição flexível

2. **Render Props**
   - Componentes que recebem funções como children
   - Customização avançada

3. **Context Pattern**
   - Estado compartilhado entre componentes
   - Temas globais

## Referências

- [How to Build Reusable Architecture for Large Next.js Applications](https://www.freecodecamp.org/news/reusable-architecture-for-large-nextjs-applications/)
- [Component Architecture in Large Next.js Applications](https://www.nextcraft.agency/resources/insights/ui-component-architecture)
- [How to Structure Reusable Components in a Next.js Project](https://eliezerkibet.dev/blog/building-reusable-components-nextjs)
- [shadcn/ui](https://ui.shadcn.com/)
