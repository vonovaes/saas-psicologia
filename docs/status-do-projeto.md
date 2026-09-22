# Status do Projeto — SaaS para Psicólogos

> Documento vivo que rastreia o progresso do desenvolvimento e as próximas etapas.

## Status Atual: 21/09/2026

### Fase Atual: Pré-soft-launch (Fase 8 em preparação)

### Progresso Geral

| Fase | Status | Progresso |
|------|--------|-----------|
| Fase 0 - Fundação Técnica | ✅ Completo | 100% |
| Fase 1 - Dados e Resolução de Tenant | ✅ Completo | 100% |
| Fase 2 - Autenticação e Painel Básico | ✅ Completo | 100% |
| Fase 3 - Painel Administrativo | ✅ Completo | 100% |
| Fase 4 - Landing Page Pública | ✅ Completo | 100% |
| Fase 5 - Domínios Personalizados e SSL | 🔶 Em andamento | 75% |
| Fase 6 - Analytics e Tracking | ⏳ Pendente | 0% |
| Fase 7 - Segurança e LGPD | ✅ Completo | 100% |
| Fase 8 - Preparação para Produção | 🔶 Em andamento | 35% |
| Editor Visual (E-1 → E5) | ✅ Completo | 100% |
| Backoffice da plataforma | ✅ Completo | 100% |
| Recuperação de senha | ✅ Completo | 100% |

## Entregas Recentes (set/2026)

### Editor Visual — completo
- Edição inline de texto com TipTap (negrito, itálico, alinhamento, multilinha)
- Edição inline de imagens (upload Vercel Blob, remoção, popover posicionado)
- Listas editáveis (especialidades, abordagens)
- Seções: reordenar, ocultar, remover, adicionar (SectionsPanel)
- FAQ dentro do fluxo draft/publish (página /faq removida — sem código morto)
- Personalização: cores, tipografia, template (PersonalizePanel)
- Draft/publish com autosave, undo/redo, device preview, mobile fullscreen
- Um único `SiteRenderer` para editor e página pública

### Onboarding novo (6 passos)
`Sobre você → Foto → Especialidades → Contato → FAQ → Visual`
- Upload de foto de perfil com preview (opcional)
- FAQ com até 5 pares pergunta/resposta e sugestões (opcional)
- Ao finalizar salva tudo como **rascunho** e leva direto ao editor —
  "publicar" virou o evento de ativação do usuário

### Tour guiado do editor (driver.js)
- 4 passos curtos com indicador de progresso: clique-para-editar, seções, personalizar, publicar
- Dispara só com `?tour=1` (fim do onboarding), uma vez por dispositivo, pulável

### Backoffice da plataforma (`/admin`)
- `isSuperAdmin` no User + propagado no JWT/sessão
- Tabela de tenants: status, leads, página publicada, domínios, cadastro
- Suspender/reativar tenant (a landing cai em `/suspended` automaticamente)
- `GET/PATCH /api/admin/tenants` com guard + audit log
- `scripts/create-admin.ts` — cria tenant plataforma + usuário admin

### Recuperação de senha
- `PasswordResetToken`: hash SHA-256, uso único, expira em 1h
- `/forgot-password` + `/reset-password` com visual do login
- Resposta genérica (não enumera emails); 502 se o SMTP falhar
- Email via Gmail SMTP (Nodemailer + senha de app) — `src/server/lib/email.ts`

### Domínios (Fase 5)
- `/api/vercel/domains` com auth + tenantId (era pública — corrigido)
- Persistência na tabela `Domain`, resolução por host conectada
- `/dashboard/dominio`: adicionar, verificar (DNS/SSL), monitorar, remover
- Todo `*.vercel.app` tratado como host da plataforma (previews OK)

### Housekeeping
- `middleware.ts` → `proxy.ts` (codemod Next 16)
- `next 16.3.2 → 16.3.5` (2 CVEs críticos de RCE corrigidos)
- `vitest → 5.0.1` + `@types/node ^24`; `npm test` em modo `vitest run`
- Barra de progresso de navegação (`nextjs-toploader`) no root layout

### WhatsApp CTA
- Botão "Agendar Consulta" abre `wa.me` com mensagem pré-preenchida:
  "Olá, vim pelo Acolha e gostaria de agendar uma sessão."
- Helper `src/lib/whatsapp.ts` usado no Hero, Contato e Footer
- Fallback: sem número configurado, o botão rola para a seção de contato

## Variáveis de Ambiente

| Var | Uso |
|-----|-----|
| `DATABASE_URL` | Neon Postgres |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | Auth.js |
| `BLOB_READ_WRITE_TOKEN` | Upload de imagens (Vercel Blob) |
| `VERCEL_TOKEN` / `VERCEL_PROJECT_ID` | Domínios customizados |
| `PLATFORM_HOSTS` | Hosts da plataforma (ex: `acolha-psicologos.vercel.app`) |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Email transacional (reset de senha) |
| `APP_URL` | Base dos links de email (produção: URL da Vercel) |

## Problemas Conhecidos

1. **`PUBLIC_ROUTES` com `'/'`** — `startsWith('/')` casa tudo no proxy;
   a resolução de tenant via proxy é dead code (a resolução real acontece
   em `page.tsx` + `/api/public/data`). Revisitar na Fase de subdomínios.
2. **`/profile` legado** — página antiga ainda existe; o editor cobre os
   casos. Avaliar redirect/remoção.
3. **4 vulns altas no audit** — cadeia do Prisma (`mysql2`, `deepmerge-ts`);
   só corrigíveis com downgrade breaking Prisma 7→6. `mysql2` não é usado
   (Postgres). Aceito conscientemente.
4. **Emails podem cair em spam** — remetente `@gmail.com`. Migrar para
   Resend/SES quando houver domínio próprio melhora entregabilidade.

## Decisão Estratégica Pendente — Domínios

Dois modelos possíveis (não excludentes):

- **A. Subdomínio da plataforma** (`drjoao.acolha.com.br`) — comprar um
  domínio raiz, wildcard DNS na Vercel, subdomínio gerado do slug no
  signup. Zero configuração pro psicólogo. **É o modelo alinhado ao
  produto** — o sistema cria e gerencia o endereço.
- **B. Domínio próprio do psicólogo** (`dramaria.com.br`) — já funciona
  via `/dashboard/dominio`, mas deve virar fluxo premium/admin-gerenciado.

Pré-requisito do modelo A: comprar `acolha.com.br` (ou similar) e apontar
nameservers para a Vercel.

## Próximos Passos

### Imediato
1. Merge/deploy das branches abertas
2. Configurar `GMAIL_*` e `APP_URL` na Vercel; testar reset em produção
3. Decidir compra do domínio raiz (modelo A)

### Pré-soft-launch
4. SEO/metadata por tenant (OG image — preview bonito no WhatsApp)
5. Subdomínios automáticos (se domínio comprado): `slug.acolha.com.br`
6. Soft launch com 2–5 psicólogos reais

### Pós-feedback
7. Fase 6 — Analytics: injetar GTM/GA/Meta Pixel por tenant (campos já
   existem em `TenantSettings`) + eventos de conversão
8. Notificação de lead (WhatsApp/email para o psicólogo)
9. Billing: Mercado Pago + planos (domínio próprio e analytics = Pro)
10. Backoffice v2: métricas (cadastros/semana, taxa de publicação)
11. Mais cobertura de testes (useEditorState, publish, upload, auth)

## Métricas do Projeto

- Tabelas: 10 (Tenant, Domain, TenantSettings, TenantProfile, User,
  PasswordResetToken, Faq, Lead, AuditLog, TenantTheme)
- Rotas API: ~15 · Páginas: ~15
- Testes: Vitest 5 + jsdom (3 testes — cobertura mínima, ampliar)
- Deploy: Vercel (`acolha-psicologos.vercel.app`)

## Observações

- Desenvolvimento solo em horas vagas; foco em MVP e baixo custo
- Regra de trabalho: feature branch a partir de `origin/development`,
  commit, push, PR para `development`. Nunca commitar em `development`/`main`.
- Após migration Prisma: `npx prisma generate`.
