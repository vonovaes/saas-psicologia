# Status do Projeto — SaaS para Psicólogos

> Documento vivo que rastreia o progresso do desenvolvimento e as próximas etapas.

## Status Atual: 22/08/2026

### Fase Atual: Fase 7 - Segurança e LGPD (Em Progresso)

### Progresso Geral

| Fase | Status | Progresso |
|------|--------|-----------|
| Fase 0 - Fundação Técnica | ✅ Completo | 100% |
| Fase 1 - Dados e Resolução de Tenant | ✅ Completo | 100% |
| Fase 2 - Autenticação e Painel Básico | ✅ Completo | 100% |
| Fase 3 - Painel Administrativo | ✅ Completo | 100% |
| Fase 4 - Landing Page Pública | ✅ Completo | 100% |
| Fase 5 - Domínios Personalizados e SSL | ⏳ Pendente | 0% |
| Fase 6 - Analytics e Tracking | ⏳ Pendente | 0% |
| Fase 7 - Segurança e LGPD | 🚧 Em Progresso | 95% |
| Fase 8 - Preparação para Produção | ⏳ Pendente | 0% |

## Detalhamento por Fase

### Fase 0 - Fundação Técnica ✅

**Objetivo:** Configurar ambiente, stack e infraestrutura básica.

**Concluído:**
- ✅ Projeto Next.js 16 criado com App Router, TypeScript, Tailwind CSS 4
- ✅ Estrutura com `src/` e alias `@/*`
- ✅ Dependências instaladas e ESLint validado
- ✅ Prisma 7.9.1 configurado com PostgreSQL (Neon)
- ✅ Repository Git local configurado
- ✅ Documentação inicial criada

**Arquivos Chave:**
- `package.json` - Dependências do projeto
- `next.config.ts` - Configuração do Next.js
- `tsconfig.json` - Configuração TypeScript
- `tailwind.config.ts` - Configuração Tailwind
- `.env` - Variáveis de ambiente

### Fase 1 - Dados e Resolução de Tenant ✅

**Objetivo:** Implementar schema multi-tenant e sistema de resolução por domínio.

**Concluído:**
- ✅ Schema Prisma completo (8 tabelas, enums, índices, soft delete)
- ✅ Migration inicial criada e aplicada
- ✅ Repository Pattern com tenant-aware (BaseRepository)
- ✅ Services para todas as entidades
- ✅ DTOs com Zod para validação
- ✅ Factory para repositories com contexto de tenant
- ✅ Middleware de resolução de tenant por host
- ✅ TenantContext para acesso ao contexto
- ✅ TenantResolutionService com cache
- ✅ Sistema de isolamento de dados

**Arquivos Chave:**
- `prisma/schema.prisma` - Schema do banco
- `src/server/repositories/*.ts` - Repositories
- `src/server/services/*.ts` - Services
- `src/server/dtos/*.ts` - DTOs
- `src/server/lib/tenant-context.ts` - Contexto de tenant
- `src/server/services/tenant-resolution.service.ts` - Resolução de tenant
- `src/middleware.ts` - Middleware Next.js

**Entidades Implementadas:**
- Tenant
- Domain
- TenantSettings
- TenantProfile
- User
- FAQ
- Lead
- AuditLog

### Fase 2 - Autenticação e Painel Básico ✅

**Objetivo:** Implementar sistema de autenticação e painel básico.

**Concluído:**
- ✅ Auth.js v5 configurado com Credentials provider
- ✅ Hash de senhas com bcrypt
- ✅ Login funcional com email/senha
- ✅ Sessão JWT com tenantId e role
- ✅ Página de login (`/login`)
- ✅ Página de dashboard básica (`/dashboard`)
- ✅ Middleware de autenticação
- ✅ Script de seed para dados de teste
- ✅ Validação de credenciais com Zod
- ✅ Verificação de status do tenant

**Arquivos Chave:**
- `src/server/lib/auth.ts` - Configuração Auth.js
- `src/app/api/auth/[...nextauth]/route.ts` - Handler Auth.js
- `src/app/login/page.tsx` - Página de login
- `src/app/dashboard/page.tsx` - Página de dashboard
- `src/middleware.ts` - Middleware de autenticação
- `prisma/seed.ts` - Script de seed

**Credenciais de Teste:**
- Email: admin@psicologos.test
- Senha: password123
- Domínio: localhost

**Status do Git:**
- Branch atual: development
- Último commit: 228e677 - feat: implement secure file upload validation and Vercel Blob integration
- Status: Sincronizado com origin/development
- Arquivos modificados: 8 files changed, 562 insertions(+), 17 deletions(-)
- Em progresso: Fase 7 - Segurança e LGPD (85% completo)

### Fase 3 - Painel Administrativo ✅ Concluída

**Objetivo:** Implementar telas completas do painel administrativo.

**Concluído:**
- ✅ Dashboard básico funcional
- ✅ Tela de edição de perfil (formulário com validação)
- ✅ Tela de gestão de FAQ (CRUD completo)
- ✅ Tela de visualização de leads (filtros e exportação CSV)
- ✅ Biblioteca de componentes UI reutilizáveis
- ✅ Arquitetura de componentes documentada
4. Implementar tela de domínios (integração Vercel Domains API)
5. Implementar tela de leads (listagem e filtros)

### Fase 4 - Landing Page Pública ✅ Concluída

**Objetivo:** Criar landing page de conversão otimizada com design premium.

**Concluído:**
- ✅ Landing page premium com design dark mode 2026
- ✅ Hero section com gradient effects e glassmorphism
- ✅ Seção sobre com cards translúcidos
- ✅ Seção de especialidades com hover effects
- ✅ FAQ com accordion interativo
- ✅ Formulário de contato para leads
- ✅ Footer com informações de contato
- ✅ Multi-tenant resolution por host
- ✅ Design responsivo e mobile-first

### Fase 5 - Domínios Personalizados e SSL ⏳

**Objetivo:** Implementar sistema de domínios personalizados com SSL automatizado.

**Pendente:**
- ⏳ Integração Vercel Domains API
- ⏳ Validação de DNS
- ⏳ Monitoramento de SSL
- ⏳ Renovação automática
- ⏳ Instruções de configuração

### Fase 6 - Analytics e Tracking ⏳

**Objetivo:** Implementar sistema de tracking de conversão por tenant.

**Pendente:**
- ⏳ dataLayer por tenant
- ⏳ Injeção condicional de scripts
- ⏳ Eventos de conversão personalizados
- ⏳ Configuração de IDs por tenant

### Fase 7 - Segurança e LGPD 🚧 Em Progresso

**Objetivo:** Implementar requisitos de segurança e privacidade.

**Concluído:**
- ✅ Headers de segurança no Next.js config
- ✅ Política de privacidade completa (LGPD compliant)
- ✅ Consentimento explícito no formulário de contato
- ✅ Página de direitos de dados (acesso, correção, exclusão)
- ✅ API endpoint para solicitações de direitos de dados
- ✅ Navegação do painel atualizada com link para direitos de dados
- ✅ Audit log para solicitações de direitos de dados
- ✅ Rate limiting em rotas públicas (/api/lead e /api/public/data)
- ✅ Headers informativos de rate limit (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- ✅ Validação de uploads (tipo, tamanho, assinatura de arquivo)
- ✅ Upload service com Vercel Blob integration
- ✅ API endpoint para uploads (/api/upload)
- ✅ Proteção contra uploads maliciosos (magic bytes validation)
- ✅ Proteção CSRF em rotas públicas (validação de Origin/Referer)
- ✅ Proteção CSRF no Auth.js (configuração de secure cookies)
- ✅ Headers de segurança adicionais em respostas CSRF

**Pendente:**
- ⏳ Fluxo de exclusão de dados automatizado
- ⏳ Auditoria de ações sensíveis

### Fase 8 - Preparação para Produção ⏳

**Objetivo:** Preparar ambiente para lançamento.

**Pendente:**
- ⏳ Configuração de ambiente de produção
- ⏳ Setup de domínio principal
- ⏳ Backup e restore
- ⏳ Monitoramento
- ⏳ Processo de onboarding
- ⏳ Documentação de suporte
- ⏳ Soft launch com 2-5 clientes

## Problemas Conhecidos e Soluções

1. **Email de teste inválido** ✅ Resolvido
   - Problema: Zod rejeitava `admin@localhost` como email inválido
   - Solução: Alterado para `admin@psicologos.test`

2. **Edge Runtime com Prisma** ✅ Resolvido
   - Problema: Middleware não pode usar Prisma diretamente
   - Solução: Usar API interna `/api/tenant-resolve`

3. **Contexto de tenant no login** ✅ Resolvido
   - Problema: Middleware não injetava contexto para rotas de login
   - Solução: Middleware resolve tenant para rotas de login

4. **Índice único composto no Prisma** ✅ Resolvido
   - Problema: `findUnique` não aceitava apenas `email`
   - Solução: Alterado para `findFirst`

5. **Auth.js v5 authorize callback** ✅ Resolvido
   - Problema: Não tem acesso fácil ao contexto de request
   - Solução: Buscar usuário globalmente e validar tenant no callback

6. **Middleware deprecation warning** ⏳ Pendente
   - Problema: Next.js 16 deprecou "middleware" em favor de "proxy"
   - Solução: Planejada migração para proxy.ts

## Métricas do Projeto

- **Total de arquivos:** ~92
- **Linhas de código:** ~6300
- **Tabelas no banco:** 8
- **Services implementados:** 9 (adicionado UploadService)
- **Repositories implementados:** 8
- **DTOs implementados:** 9 (adicionado upload.dto)
- **Rotas API:** 10 (adicionado /api/upload)
- **Páginas implementadas:** 7 (login, dashboard, profile, faq, leads, landing page, privacy, data-rights)
- **Componentes UI:** 6 (Input, Textarea, Select, Button, FieldGroup, Accordion)
- **Security features:** Rate limiting, security headers, privacy policy, data rights portal, upload validation, CSRF protection
- **Storage:** Vercel Blob integration configured
- **Security libraries:** CSRF protection utilities (session-based and public request validation)

## Próximos Passos Imediatos

1. Implementar fluxo de exclusão de dados automatizado
2. Implementar auditoria de ações sensíveis
3. Implementar gestão de domínios personalizados (integração Vercel API)
4. Implementar sistema de analytics e tracking
5. Testar fluxo completo end-to-end
6. Preparar para produção

## Observações Importantes

- O projeto está em desenvolvimento solo em horas vagas
- Foco em funcionalidades core do MVP
- Decisões técnicas priorizam baixo custo operacional
- Documentação mantida atualizada para facilitar retomada
- Branch principal único (sem feature branches ainda)
