# Status do Projeto — SaaS para Psicólogos

> Documento vivo que rastreia o progresso do desenvolvimento e as próximas etapas.

## Status Atual: 21/08/2026

### Fase Atual: Fase 3 - Painel Administrativo (Iniciando)

### Progresso Geral

| Fase | Status | Progresso |
|------|--------|-----------|
| Fase 0 - Fundação Técnica | ✅ Completo | 100% |
| Fase 1 - Dados e Resolução de Tenant | ✅ Completo | 100% |
| Fase 2 - Autenticação e Painel Básico | ✅ Completo | 100% |
| Fase 3 - Painel Administrativo | 🔄 Em Andamento | 10% |
| Fase 4 - Landing Page Pública | ⏳ Pendente | 0% |
| Fase 5 - Domínios Personalizados e SSL | ⏳ Pendente | 0% |
| Fase 6 - Analytics e Tracking | ⏳ Pendente | 0% |
| Fase 7 - Segurança e LGPD | ⏳ Pendente | 0% |
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

### Fase 3 - Painel Administrativo 🔄

**Objetivo:** Implementar telas completas do painel administrativo.

**Em Andamento:**
- ✅ Dashboard básico funcional
- ⏳ Tela de edição de perfil
- ⏳ Tela de gestão de FAQ
- ⏳ Tela de configurações
- ⏳ Tela de domínios
- ⏳ Tela de leads

**Próximas Tarefas:**
1. Implementar tela de edição de perfil (formulário com validação)
2. Implementar tela de gestão de FAQ (CRUD completo)
3. Implementar tela de configurações (WhatsApp, Instagram, Analytics)
4. Implementar tela de domínios (integração Vercel Domains API)
5. Implementar tela de leads (listagem e filtros)

### Fase 4 - Landing Page Pública ⏳

**Objetivo:** Criar landing page de conversão otimizada para Google Ads.

**Pendente:**
- ⏳ Hero section com foto e CTA
- ⏳ Seção de credibilidade
- ⏳ Seção de especialidades
- ⏳ Seção sobre o profissional
- ⏳ Como funciona o atendimento
- ⏳ Localização/mapa
- ⏳ FAQ pública
- ⏳ Formulário de contato
- ⏳ Botão flutuante de WhatsApp
- ⏳ Tracking de conversão

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

### Fase 7 - Segurança e LGPD ⏳

**Objetivo:** Implementar requisitos de segurança e privacidade.

**Pendente:**
- ⏳ Rate limiting em rotas públicas
- ⏳ Validação de uploads
- ⏳ Headers de segurança
- ⏳ Proteção contra CSRF
- ⏳ Política de privacidade
- ⏳ Fluxo de exclusão de dados
- ⏳ Consentimento explícito
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

- **Total de arquivos:** ~50
- **Linhas de código:** ~3000
- **Tabelas no banco:** 8
- **Services implementados:** 8
- **Repositories implementados:** 8
- **DTOs implementados:** 8
- **Rotas API:** 5 (health, tenant-resolve, test-resolve, test-db, debug-tenant)
- **Páginas implementadas:** 2 (login, dashboard)

## Próximos Passos Imediatos

1. Implementar tela de edição de perfil
2. Implementar tela de gestão de FAQ
3. Implementar tela de configurações
4. Testar fluxo completo de edição de dados
5. Preparar landing page básica

## Observações Importantes

- O projeto está em desenvolvimento solo em horas vagas
- Foco em funcionalidades core do MVP
- Decisões técnicas priorizam baixo custo operacional
- Documentação mantida atualizada para facilitar retomada
- Branch principal único (sem feature branches ainda)
