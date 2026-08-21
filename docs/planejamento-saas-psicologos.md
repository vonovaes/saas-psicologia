# Planejamento Completo — SaaS Multi-Tenant para Geração de Pacientes (Psicólogos)

> Documento de arquitetura e roadmap para desenvolvimento solo, em horas vagas, com foco em simplicidade, baixo custo e conversão.

---

## Índice

1. Antes de tudo: questionando as premissas
2. Visão geral e filosofia do produto
3. Decisão crítica: como resolver domínio próprio + SSL por cliente
4. Decisão crítica: estratégia de multi-tenancy no banco
5. Stack tecnológica — avaliação e alternativas
6. Hospedagem — comparação completa
7. Modelagem de banco de dados
8. Arquitetura de backend
9. Arquitetura de frontend
10. Painel administrativo
11. Landing page — template de conversão
12. Analytics e tracking por cliente
13. Segurança e LGPD
14. Deploy, CI/CD e ambientes
15. Roadmap por fases
16. Checklists finais e riscos

---

## 1. Antes de tudo: questionando as premissas

Você pediu explicitamente para eu questionar antes de aceitar a lista de tecnologias. Vou fazer isso de forma direta, porque três decisões do seu briefing são as que mais vão pesar no seu tempo de manutenção como dev solo — muito mais do que a escolha entre Next.js ou outra coisa.

**1.1. "Domínio personalizado para cada cliente" é a decisão mais cara do projeto.**
Não tecnicamente impossível, mas é o ponto onde 90% dos SaaS multi-tenant solo travam, porque envolve emissão de certificado SSL automatizada por domínio de terceiro, validação DNS, renovação, e roteamento dinâmico. Se você tentar construir isso "na mão" (Nginx + Certbot + scripts), vai gastar semanas em algo que grandes players já resolveram como produto. **Minha recomendação: não construa a automação de SSL/domínio você mesmo.** Use a API de Domains da Vercel ou o "Cloudflare for SaaS" — ambos existem exatamente para este caso (SaaS multi-tenant com domínio custom por cliente) e cuidam de emissão de certificado e validação automaticamente. Isso transforma um problema de infraestrutura de semanas em uma chamada de API de poucas linhas. Detalho isso na seção 3.

**1.2. Você não precisa (ainda) de arquitetura "preparada para 500 clientes" desde o dia 1.**
Isso soa contra-intuitivo, mas para 10–50 clientes, qualquer estratégia de multi-tenancy razoável (banco compartilhado com `tenant_id`) aguenta tranquilamente até a casa de milhares de linhas de dados. O erro comum de devs backend sênior é super-engenheirar a separação de tenants (schema-per-tenant, banco-per-tenant) achando que isso é "mais escalável", quando na prática isso só aumenta a complexidade operacional (migrations em N bancos, backups em N bancos) sem necessidade real nesse volume. Recomendo shared database, shared schema, com `tenant_id` — ver seção 4.

**1.3. A lista de "não quero" está correta e deve ser defendida com força durante o roadmap.**
CRM, blog, editor visual, agendamento, IA, múltiplos templates — cada um desses é, historicamente, o motivo pelo qual MVPs de agência viram produtos impossíveis de manter sozinho. Vou manter isso como restrição rígida no roadmap, inclusive sugerindo o que fazer quando (não se) um cliente pedir uma dessas features antes da hora.

**1.4. Sobre a stack proposta (Next.js/TS/Tailwind/Prisma/Postgres):** é uma escolha sólida e não vou trocá-la por modismo. Mas vou propor ajustes pontuais (hospedagem do Postgres, storage de imagens, ORM) que reduzem a carga operacional de um dev solo — detalhado na seção 5.

Com essas ressalvas registradas, o restante do documento segue a estrutura pedida.

---

## 2. Visão geral e filosofia do produto

- **O que é vendido:** geração de pacientes via landing page de alta conversão + Google Ads. O site é meio, não fim.
- **O que NÃO é vendido:** criação de sites, CMS, ferramentas de marketing genéricas.
- **Métrica de sucesso do produto:** taxa de conversão (visita → contato via WhatsApp/formulário), não "quantidade de recursos".
- **Princípio orientador de toda decisão técnica:** se a feature não aumenta conversão, não reduz custo operacional, ou não é essencial para o psicólogo publicar seu conteúdo, ela fica de fora do MVP — sem exceção.

---

## 3. Decisão crítica: domínio próprio + SSL por cliente

### O problema real
Cada psicólogo quer `www.psicologojoao.com.br` apontando para o seu sistema, com HTTPS válido, sem que o cliente perceba a infraestrutura compartilhada.

### Três caminhos possíveis

| Abordagem | Como funciona | Esforço solo | Recomendação |
|---|---|---|---|
| **A. Vercel Domains API** | Você registra domínios de clientes via API da Vercel no seu projeto; a Vercel emite certificado (Let's Encrypt) e faz o roteamento automaticamente | Baixo — poucas chamadas de API, painel próprio já resolve 90% | ✅ Recomendado para o MVP |
| **B. Cloudflare for SaaS** | Você usa "Custom Hostnames" do Cloudflare; certificados emitidos automaticamente; funciona com qualquer host de origem | Baixo-médio — mais flexível, porém custo por hostname ativo (paga por domínio custom acima de um free tier) | ✅ Alternativa válida, especialmente se sair da Vercel no futuro |
| **C. Fazer na mão (Nginx + Certbot + wildcard DNS)** | Você mesmo gerencia certificados, renovação, roteamento por header Host | Alto — exige monitoramento de renovação, scripts de validação DNS-01, risco de downtime por certificado expirado | ❌ Não recomendado para 1 pessoa em horas vagas |

### Recomendação final
Comece com **Vercel + Vercel Domains API**. O fluxo operacional fica assim:
1. Psicólogo cadastra o domínio dele no seu painel admin.
2. Seu backend chama a API da Vercel (`POST /v10/projects/{id}/domains`) adicionando o domínio ao projeto.
3. Você mostra ao cliente os registros DNS que ele precisa configurar (CNAME ou A record) — pode ser um passo manual dele ou, se ele usar Cloudflare como DNS, você pode automatizar via API do Cloudflare também.
4. A Vercel emite e renova o certificado SSL automaticamente assim que o DNS propaga.

Isso resolve tecnicamente o mesmo problema que motivaria uma arquitetura de "Nginx + wildcard cert" — mas sem você ter que operar isso.

### Identificação de tenant na requisição
Independente da hospedagem, a aplicação Next.js identifica o tenant assim:
- Middleware do Next.js lê o header `Host` da requisição.
- Busca (com cache, ex. Redis ou in-memory com TTL curto) a configuração do tenant correspondente àquele domínio numa tabela `tenants`.
- Injeta o `tenantId` no contexto da requisição (via headers internos ou `AsyncLocalStorage`), usado depois nas queries do Prisma.

---

## 4. Decisão crítica: estratégia de multi-tenancy no banco

### Opções avaliadas

| Estratégia | Descrição | Prós | Contras | Adequado para |
|---|---|---|---|---|
| **Shared DB + Shared Schema (tenant_id)** | Uma única base, uma tabela por entidade, coluna `tenant_id` em tudo | Simples de operar, 1 migration para todos, barato | Exige disciplina para nunca esquecer o filtro `tenant_id` | ✅ 10–500+ clientes |
| **Schema per tenant** | Um schema Postgres por cliente | Isolamento lógico maior | N schemas para migrar, mais complexidade de tooling | Só faz sentido com dezenas de milhares de tenants ou exigência contratual de isolamento forte |
| **Database per tenant** | Um banco por cliente | Isolamento máximo | Inviável operar sozinho com dezenas de clientes; custo de infra dispara | ❌ Não recomendado aqui |

### Recomendação
**Shared DB + Shared Schema com `tenant_id`.** Para mitigar o risco de "esquecer o filtro", duas práticas:
1. Nunca acessar o Prisma Client "cru" nos endpoints — sempre passar por uma camada de *Repository* que já recebe o `tenantId` obrigatoriamente no construtor/contexto (detalhado na seção 8).
2. Adicionar `tenant_id` como parte de índices compostos (ex. `@@index([tenantId, createdAt])`) desde o início — evita retrabalho de performance depois.

Essa escolha também é o motivo pelo qual você **não** precisa se preocupar agora com "preparar para 500 clientes": o modelo shared-schema escala nativamente até volumes bem maiores que isso sem nenhuma refatoração estrutural — apenas ajustes de índice/cache quando necessário.

---

## 5. Stack tecnológica — avaliação e alternativas

| Camada | Sua proposta | Avaliação | Alternativa sugerida |
|---|---|---|---|
| Framework | Next.js + TS | ✅ Mantém — App Router com Server Components reduz JS no client, bom para performance/conversão | — |
| Estilo | Tailwind | ✅ Mantém — rápido para 1 dev sem especialista em UX/UI, usa design tokens prontos | — |
| ORM | Prisma | ✅ Mantém — DX excelente, migrations simples, type-safety | Alternativa: Drizzle (mais leve, SQL-like) — só migre se performance de cold start virar problema real |
| Banco | PostgreSQL | ✅ Mantém | Hospedagem gerenciada: **Neon** ou **Supabase** (Postgres serverless, backup automático, branch de banco para homologação) em vez de operar Postgres você mesmo |
| Storage de imagens | (não definido) | — | **Cloudflare R2** (S3-compatible, sem custo de egress) ou **Vercel Blob** para simplicidade máxima de integração |
| Autenticação | (não definida) | — | **Auth.js (NextAuth)** ou **Clerk**. Para o painel do psicólogo (poucos usuários, sem necessidade de SSO/social login complexo), Auth.js com credenciais + hashing (bcrypt/argon2) é suficiente e sem custo |
| Domínio/SSL | manual | ❌ Rever | Vercel Domains API / Cloudflare for SaaS (seção 3) |
| Fila/cache (futuro) | — | — | Upstash Redis (serverless, paga por uso) quando necessário para cache de tenant lookup |

**Conclusão:** a stack proposta está correta em sua essência. Os ajustes são principalmente sobre **onde hospedar cada peça** para minimizar operação manual — não sobre trocar as tecnologias centrais.

---

## 6. Hospedagem — comparação completa

| Plataforma | Custo inicial (10–50 clientes) | Domínio custom multi-tenant | Facilidade solo dev | Escalabilidade | Observação |
|---|---|---|---|---|---|
| **Vercel** | Free/Pro (~US$20/mês) | ✅ Nativo via Domains API | ✅✅✅ Altíssima | Boa até milhares de req/s | Melhor encaixe com Next.js; zero DevOps |
| **Cloudflare Pages/Workers** | Free tier generoso | ✅ Via Cloudflare for SaaS | ✅✅ Alta | Excelente (edge global) | Bom se quiser sair do vendor lock-in da Vercel; setup um pouco mais manual |
| **Railway** | ~US$5–20/mês | ⚠️ Manual (sem produto pronto p/ multi-domínio) | ✅✅ Alta | Média | Ótimo para backend/worker, menos pronto para o caso de domínio-por-cliente |
| **Render** | ~US$7–25/mês | ⚠️ Manual | ✅✅ Alta | Média | Similar ao Railway |
| **Fly.io** | Baixo, pay-as-you-go | ⚠️ Manual (via seus próprios certs) | ✅ Média (exige mais config) | Alta | Mais controle, mais responsabilidade operacional |
| **AWS** | Variável, pode ficar caro se mal configurado | ✅ Possível (ACM + CloudFront + Route53) mas você constrói tudo | ❌ Baixa para 1 pessoa em horas vagas | Altíssima | Only if you already have AWS ops experience de sobra — não recomendado aqui |
| **Azure** | Similar à AWS | ✅ Possível, mas complexo | ❌ Baixa | Alta | Mesmo racional da AWS |
| **DigitalOcean** | ~US$5–20/mês (droplets/App Platform) | ⚠️ Manual | ✅ Média | Média | Bom custo-benefício, mas exige mais setup manual que Vercel |

### Recomendação final de hospedagem
- **Aplicação (Next.js):** Vercel (Hobby para desenvolvimento, Pro em produção).
- **Banco de dados:** Neon (Postgres serverless) — tem branch de banco de dados por ambiente, backup automático e point-in-time recovery inclusos mesmo em planos baixos.
- **Storage de imagens:** Cloudflare R2.
- **DNS/Domínios auxiliares (seu domínio raiz do painel, ex. `app.seusaas.com`):** Cloudflare.

Essa combinação praticamente elimina DevOps manual: sem servidor para atualizar, sem certificado para renovar na mão, backup e rollback de banco resolvidos pelo provedor.

**Por que não AWS/Azure para o MVP:** ambos exigem que você monte, sozinho, o equivalente do que Vercel+Neon já entregam prontos (CDN, certificados, autoscaling, backups). Para um solo dev em horas vagas, isso é tempo tirado de features que geram receita. Migrar para AWS depois — se um cliente enterprise exigir isso contratualmente — é possível sem reescrever a aplicação, só a camada de infraestrutura.

---

## 7. Modelagem de banco de dados

### Entidades principais (sem gerar migrations, apenas modelo conceitual)

**`tenants`**
- id, nome do psicólogo, CRP, e-mail de contato, status (ativo/trial/suspenso), plano, createdAt

**`domains`**
- id, tenantId (FK), domínio (ex. `psicologojoao.com.br`), status de verificação DNS, sslStatus, isPrimary

**`tenant_settings`** (1:1 com tenant)
- googleAnalyticsId, googleTagManagerId, googleAdsId, metaPixelId, whatsappNumber, instagramHandle, googleMapsEmbedUrl

**`tenant_profile`** (conteúdo da landing page)
- nome exibido, especialidades (array ou tabela relacionada), cidade, descrição, endereço, foto (referência ao storage)

**`faqs`**
- id, tenantId, pergunta, resposta, ordem

**`leads`** (contatos gerados pela landing page — formulário)
- id, tenantId, nome, telefone, mensagem, origem (whatsapp/formulário), createdAt

**`users`** (login do painel administrativo)
- id, tenantId, e-mail, senha (hash), papel (owner/admin — mesmo que hoje só exista 1 papel, deixe o campo pronto)

### Relacionamentos
- `tenants` 1:N `domains`
- `tenants` 1:1 `tenant_settings`
- `tenants` 1:1 `tenant_profile`
- `tenants` 1:N `faqs`
- `tenants` 1:N `leads`
- `tenants` 1:N `users`

### Como garantir isolamento de dados
- Toda tabela (exceto `tenants`) carrega `tenantId` obrigatório.
- Nenhuma query direta ao Prisma Client fora da camada de Repository (seção 8) — o Repository sempre recebe `tenantId` do contexto de request e aplica o filtro automaticamente, eliminando a possibilidade de esquecimento humano.
- Índices compostos com `tenantId` como primeira coluna para toda tabela de alto volume (`leads`, por exemplo).

### Preparação para crescimento
- Mantenha `tenantId` como `varchar`/`cuid`, nunca sequencial incremental (evita enumeração de tenants por terceiros).
- Adicione `deletedAt` (soft delete) desde o início — evita migrations dolorosas depois para "lixeira"/auditoria.
- Não crie índices excessivos agora; adicione conforme queries reais de produção mostrarem necessidade (evita over-engineering).

---

## 8. Arquitetura de backend

### Estrutura de pastas (dentro do projeto Next.js)

```
/src
  /app                  → rotas (App Router), Server Components por padrão
  /server
    /repositories        → acesso a dados, sempre tenant-aware
    /services            → regras de negócio (ex. LeadService, TenantService)
    /dtos                → schemas de validação (zod) de entrada/saída
    /middlewares          → resolução de tenant, autenticação
    /lib                  → clients (prisma, storage, email)
  /components            → componentes de UI reutilizáveis
  /features               → componentes/lógica específicos de cada tela do painel
```

### Camadas e responsabilidades
- **Route Handler / Server Action:** recebe request, valida input com DTO (zod), chama o Service. Não contém regra de negócio.
- **Service:** orquestra regra de negócio (ex. "ao criar lead, validar tenant ativo, salvar, disparar evento de analytics").
- **Repository:** única camada que toca o Prisma Client. Sempre recebe `tenantId` — nunca expõe métodos sem esse parâmetro.
- **DTO (zod):** valida e tipa toda entrada externa (formulários, uploads, API).

### Autenticação e autorização
- Auth.js com provider de credenciais (e-mail/senha com hash argon2) para o painel administrativo.
- Sessão via JWT ou cookie de sessão gerenciado pelo Auth.js.
- Autorização simples: todo recurso do painel só pode ser acessado se `session.tenantId === recurso.tenantId` — checagem centralizada num middleware, não espalhada pelos endpoints.

### Uploads
- Upload direto do client para o storage (R2/Vercel Blob) via URL pré-assinada gerada pelo backend — evita que a imagem passe pelo seu servidor/função serverless (reduz custo e latência).
- Validação de tipo/tamanho de arquivo no backend antes de gerar a URL assinada.

### Tratamento de erros
- Camada de erro única (`AppError` com código e mensagem) capturada num handler central que traduz para respostas HTTP consistentes.
- Nunca vazar stack trace ou detalhes internos para o client em produção.

### Padrões de projeto aplicados
- Repository Pattern (isolamento de dados por tenant).
- Service Layer (regra de negócio isolada de HTTP).
- DTO/Validation Layer (zod) — única fonte de verdade de tipos de entrada.

---

## 9. Arquitetura de frontend

### Server vs Client Components
- **Server Components (padrão):** toda a landing page (conteúdo estático por request, SEO-crítico, não interativo) — maximiza performance e minimiza JS enviado ao browser.
- **Client Components (exceção, uso pontual):** formulário de contato, botão de WhatsApp com tracking de clique, itens interativos do painel administrativo (formulários de edição).

### Estrutura de páginas
```
/app
  /(public)
    /page.tsx              → landing page (resolve tenant pelo host)
  /(admin)
    /login/page.tsx
    /dashboard/page.tsx
    /dashboard/perfil/page.tsx
    /dashboard/faq/page.tsx
    /dashboard/dominio/page.tsx
```

### Design System mínimo
- Tokens Tailwind centralizados (cores, tipografia, espaçamento) em `tailwind.config` — cada tenant usa os mesmos componentes, variando apenas cor primária/logo/foto via `tenant_settings`.
- Componentes de landing page parametrizados por props vindas do banco (não por template diferente — um único template, dados diferentes).

### Responsividade e acessibilidade
- Mobile-first (a maior parte do tráfego de Google Ads para serviços locais é mobile).
- Contraste de cor mínimo AA, `alt` em todas as imagens, formulário navegável por teclado.

### SEO e performance
- Metadata dinâmica por tenant (`generateMetadata` do Next.js lendo dados do tenant resolvido).
- Imagens via `next/image` com otimização automática.
- Core Web Vitals como métrica de aceitação de cada release da landing page (afeta diretamente o Quality Score do Google Ads).

---

## 10. Painel administrativo

Escopo fechado — apenas o necessário para editar a própria landing page:

- **Tela de login** (e-mail/senha).
- **Tela "Meu Perfil":** nome, CRP, especialidades, cidade, descrição, foto (upload), endereço, WhatsApp, Instagram, link do Google Maps.
- **Tela "FAQ":** lista simples de perguntas/respostas com reordenação.
- **Tela "Domínio":** campo para inserir o domínio próprio + status de verificação (pendente/ativo) + instruções de DNS.
- **Tela "Analytics":** campos para GA ID, GTM ID, Google Ads ID, Meta Pixel ID (opcional).

Nada de dashboard de métricas complexo no MVP — isso pode virar uma fase futura (ex. mostrar número de leads recebidos, que já está no banco).

---

## 11. Landing page — template de conversão

### Ordem de seções recomendada (e por quê)

1. **Hero (acima da dobra):** foto profissional, nome, especialidade principal, CTA imediato ("Agende sua consulta pelo WhatsApp"). Objetivo: comunicar em 3 segundos "sou psicólogo(a), atendo isso, fale comigo agora".
2. **Prova social / credibilidade:** CRP visível, anos de experiência, abordagem terapêutica. Reduz a barreira de confiança, crítica em serviços de saúde mental.
3. **Especialidades / Para quem é o atendimento:** lista curta (ex. ansiedade, casais, adolescentes) — ajuda o visitante a se identificar rapidamente.
4. **Sobre o profissional:** texto curto, humano, empático — não currículo extenso.
5. **Como funciona o atendimento:** presencial/online, duração, primeira consulta — reduz incerteza, uma das maiores barreiras de conversão em saúde mental.
6. **Localização (Google Maps embed):** relevante para quem busca atendimento presencial local (alinhado à intenção de Google Ads geolocalizado).
7. **FAQ:** objeções comuns (valores, convênio, sigilo) respondidas antes que o visitante desista.
8. **CTA final + WhatsApp fixo (sticky button):** repetição da chamada para ação, sempre visível durante o scroll.

### Psicologia da conversão aplicada
- **Redução de fricção:** WhatsApp como CTA principal (não formulário longo) — em serviços locais, contato direto converte mais que preencher campos.
- **Prova social sutil:** CRP e experiência, sem depoimentos de pacientes (eticamente sensível e regulatoriamente delicado em saúde mental — evite depoimentos identificáveis).
- **Clareza de expectativa:** FAQ elimina a maior fonte de abandono, que é incerteza sobre processo/preço/sigilo.
- **CTA único e repetido:** evitar múltiplos CTAs concorrentes (ex. não colocar "baixe meu e-book" ao lado de "chame no WhatsApp") — cada seção reforça o mesmo caminho de conversão.

### Copywriting — diretrizes gerais
- Tom acolhedor, primeira pessoa quando possível ("Estou aqui para te ajudar" em vez de "O profissional está disponível").
- Evitar jargão clínico excessivo.
- CTA sempre orientado a ação concreta ("Fale comigo agora" em vez de "Saiba mais").

---

## 12. Analytics e tracking por cliente

- **Google Tag Manager por tenant:** cada tenant tem seu próprio container GTM (ID armazenado em `tenant_settings`). O template injeta o container correto dinamicamente no `<head>`/`<body>` conforme o tenant resolvido — nunca hardcoded.
- **Google Analytics 4:** ID de propriedade próprio por tenant, disparado via GTM (centraliza toda tag management num único ponto, evitando múltiplos scripts soltos).
- **Google Ads (conversão):** tag de conversão configurada dentro do GTM do próprio cliente — você, como plataforma, só garante que os "gatilhos" (eventos) estejam disponíveis; a configuração da tag em si é do GTM de cada psicólogo (mantém a separação de contas pedida no briefing).
- **Meta Pixel (opcional):** mesmo padrão — ID armazenado, injetado condicionalmente se preenchido.

### Eventos a disparar (via `dataLayer.push`, capturados pelo GTM do tenant)
- `click_whatsapp` (clique no botão/link de WhatsApp)
- `form_submit` (envio do formulário de contato)
- `click_maps` (clique no embed/link do Google Maps)
- `page_view` (padrão, mas explicitado para consistência)

### Organização técnica
- Um único componente `<AnalyticsProvider tenant={tenant} />` no layout, responsável por injetar os scripts corretos por tenant — mantém a lógica centralizada e fácil de auditar.

---

## 13. Segurança e LGPD

- **LGPD:** leads (nome, telefone, mensagem) são dados pessoais — necessário: política de privacidade padrão (template único, dado que o produto não coleta dado sensível de saúde diretamente, apenas contato), consentimento explícito no formulário (checkbox), e rota de exclusão de dados sob solicitação (endpoint interno, mesmo que executado manualmente no início).
- **Uploads:** validação de tipo MIME real (não só extensão), limite de tamanho, upload direto para storage via URL assinada (evita que arquivo malicioso passe pelo seu servidor).
- **Rate limiting:** no formulário de contato e login — via middleware simples (ex. Upstash Ratelimit) para evitar spam/brute force.
- **Headers de segurança:** CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` configurados no `next.config`.
- **XSS:** React já escapa por padrão; cuidado extra em qualquer `dangerouslySetInnerHTML` (ex. se permitir HTML customizado em descrição — evite ou sanitize com uma lib como `sanitize-html`).
- **CSRF:** mitigado nativamente por Server Actions do Next.js (tokens/origin check); em rotas de API tradicionais, validar `Origin`/`Referer`.
- **SQL Injection:** não é uma preocupação direta usando Prisma (queries parametrizadas por padrão) — apenas evite `$queryRawUnsafe` com input não sanitizado.
- **Autenticação/permissões:** hash de senha com argon2, sessão via Auth.js, checagem de `tenantId` centralizada (seção 8).
- **Logs e auditoria:** logar ações administrativas sensíveis (edição de domínio, alteração de dados de acesso) com timestamp e usuário — mesmo que só em tabela simples `audit_logs` no início.

---

## 14. Deploy, CI/CD e ambientes

### Ambientes
- **Desenvolvimento:** local, banco Neon com branch de desenvolvimento próprio.
- **Homologação (preview):** deploy automático de Preview da Vercel para cada Pull Request, com branch de banco Neon isolada (Neon permite branch de banco por PR).
- **Produção:** branch `main`, deploy automático na Vercel ao merge.

### Fluxo Git
- `main` → produção.
- `develop` (opcional, ou trabalhar direto com PRs de feature para `main` se o ritmo solo não justificar `develop`) → homologação contínua via Preview Deploys.
- Feature branches → `feature/nome-da-feature`, PR obrigatório mesmo sozinho (facilita rastrear histórico e reverter).

### CI/CD (GitHub Actions + Vercel)
1. Push/PR dispara: lint, type-check (`tsc --noEmit`), testes (quando existirem).
2. Vercel gera Preview Deploy automaticamente a cada PR (já integrado nativamente, sem config extra de Action).
3. Merge em `main` dispara deploy de produção automaticamente.

### Variáveis de ambiente
- Gerenciadas no painel da Vercel, separadas por ambiente (Development/Preview/Production).
- Nunca versionadas no repositório; `.env.example` documentando as chaves necessárias.

### Backup e rollback
- **Backup de banco:** automático via Neon (point-in-time recovery incluso).
- **Rollback de aplicação:** Vercel mantém deploys anteriores — rollback é um clique/instantâneo.
- **Rollback de banco:** usar branch de restore do Neon para um ponto no tempo específico antes de qualquer migration problemática.

### Monitoramento, logs e alertas
- Logs de aplicação: Vercel Logs (nativo) para início; considerar Axiom/Better Stack quando o volume justificar.
- Alertas de erro: Sentry (free tier) capturando exceções não tratadas no frontend e backend.
- Uptime: um serviço simples de uptime check (ex. UptimeRobot free) monitorando a landing page principal e o painel.

### DNS, HTTPS, domínios personalizados
- Domínio raiz da plataforma (`app.seusaas.com.br`) gerenciado no Cloudflare (DNS apenas, proxy desligado se usar Vercel, para evitar conflito de certificado).
- Domínios de clientes: adicionados via Vercel Domains API (seção 3), com instruções de DNS mostradas automaticamente no painel administrativo assim que o cliente cadastra o domínio.

---

## 15. Roadmap por fases

### Fase 0 — Fundação técnica
- **Objetivo:** ambiente de desenvolvimento pronto, sem nenhuma feature de produto ainda.
- **Funcionalidades:** setup do repositório, Next.js + TS + Tailwind, Prisma conectado ao Neon, deploy inicial "hello world" na Vercel, CI básico (lint/type-check).
- **Dependências:** nenhuma.
- **Critério de conclusão:** deploy de produção acessível via domínio provisório, com pipeline de PR funcionando.
- **Tempo estimado:** 1–2 semanas (horas vagas).
- **Complexidade:** baixa.
- **Riscos:** nenhum relevante.

### Fase 1 — Modelo de dados e resolução de tenant
- **Objetivo:** multi-tenancy funcionando de ponta a ponta (ainda sem UI bonita).
- **Funcionalidades:** schema Prisma (tenants, domains, tenant_settings, tenant_profile, faqs, leads, users), middleware de resolução de tenant por `Host`, Repository Pattern implementado.
- **Dependências:** Fase 0.
- **Critério de conclusão:** acessar dois domínios de teste locais (via `/etc/hosts`) e ver dados diferentes por tenant.
- **Tempo estimado:** 2–3 semanas.
- **Complexidade:** média-alta (é o núcleo arquitetural do produto).
- **Riscos:** modelagem errada aqui é a mais cara de corrigir depois — vale revisar com calma antes de avançar.

### Fase 2 — Autenticação e painel administrativo básico
- **Objetivo:** psicólogo consegue logar e editar seus próprios dados.
- **Funcionalidades:** Auth.js, telas de Perfil/FAQ/Analytics/Domínio (seção 10), upload de imagem via URL assinada.
- **Dependências:** Fase 1.
- **Critério de conclusão:** um usuário de teste consegue editar todos os campos do briefing e ver refletido nos dados do tenant.
- **Tempo estimado:** 2–3 semanas.
- **Complexidade:** média.
- **Riscos:** vazamento de dado entre tenants se a checagem de autorização não for centralizada — testar explicitamente esse caso.

### Fase 3 — Landing page de conversão
- **Objetivo:** template público funcionando, otimizado, lendo dados reais do tenant.
- **Funcionalidades:** seções da seção 11, SEO dinâmico, WhatsApp CTA, formulário de contato, embed do Google Maps.
- **Dependências:** Fase 1 e 2 (precisa de dados reais para renderizar).
- **Critério de conclusão:** landing page publicada para pelo menos 1 cliente piloto real, com Core Web Vitals dentro do esperado.
- **Tempo estimado:** 2–3 semanas.
- **Complexidade:** média (maior parte é copy/UX, não lógica).
- **Riscos:** sem especialista em UX/UI, vale usar referências prontas de landing pages de alta conversão do próprio nicho para não reinventar.

### Fase 4 — Domínio próprio e SSL automatizado
- **Objetivo:** cliente real acessando pelo próprio domínio.
- **Funcionalidades:** integração com Vercel Domains API, tela de status de verificação DNS no painel.
- **Dependências:** Fase 2 (painel) e infraestrutura da Fase 0.
- **Critério de conclusão:** pelo menos 1 domínio de cliente real ativo com HTTPS válido, sem intervenção manual sua.
- **Tempo estimado:** 1–2 semanas.
- **Complexidade:** média (mais integração de API que lógica própria).
- **Riscos:** dependência de o cliente configurar o DNS corretamente — preveja instruções claras e validação de status.

### Fase 5 — Analytics e tracking
- **Objetivo:** cada cliente rastreando suas próprias conversões.
- **Funcionalidades:** injeção de GTM/GA/Meta Pixel por tenant, eventos de clique WhatsApp/formulário/maps.
- **Dependências:** Fase 3.
- **Critério de conclusão:** evento de teste aparecendo no GA4 de um tenant de teste.
- **Tempo estimado:** 1 semana.
- **Complexidade:** baixa-média.
- **Riscos:** nenhum estrutural, apenas atenção para não vazar tag de um tenant em outro.

### Fase 6 — Segurança, LGPD e polimento para produção
- **Objetivo:** produto pronto para receber clientes pagantes reais.
- **Funcionalidades:** rate limiting, headers de segurança, política de privacidade, Sentry, uptime monitor, revisão de permissões.
- **Dependências:** todas as fases anteriores.
- **Critério de conclusão:** checklist da seção 16 100% concluído.
- **Tempo estimado:** 1–2 semanas.
- **Complexidade:** média.
- **Riscos:** é a fase mais frequentemente pulada — não pule.

### Fase 7 — Primeiros clientes reais (soft launch)
- **Objetivo:** validar o produto com 2–5 clientes reais antes de escalar aquisição.
- **Funcionalidades:** nenhuma nova — apenas onboarding manual dos primeiros clientes, coleta de feedback.
- **Dependências:** Fase 6 concluída.
- **Critério de conclusão:** pelo menos 1 cliente gerando leads reais via Google Ads através da plataforma.
- **Tempo estimado:** contínuo.
- **Complexidade:** baixa tecnicamente, alta em atenção operacional/suporte.
- **Riscos:** feedback de cliente real pode pedir features fora do escopo (agendamento, CRM) — resistir e anotar para roadmap futuro, não para o MVP.

---

## 16. Checklists finais e riscos

### Checklist de lançamento (Fase 6 → 7)
- [ ] Multi-tenancy testado com 2+ tenants simultâneos sem vazamento de dado
- [ ] Domínio custom + HTTPS validado em pelo menos 1 domínio real
- [ ] Backup de banco confirmado (teste de restore, não só configuração)
- [ ] Rollback de deploy testado manualmente pelo menos uma vez
- [ ] Rate limiting ativo em formulário público e login
- [ ] Headers de segurança configurados e validados (ex. via securityheaders.com)
- [ ] Política de privacidade publicada e checkbox de consentimento no formulário
- [ ] Sentry capturando erros de produção
- [ ] Uptime monitor ativo
- [ ] Analytics validado end-to-end (evento real aparecendo no GA4 do tenant de teste)

### Riscos gerais do projeto (e mitigação)
| Risco | Impacto | Mitigação |
|---|---|---|
| Escopo crescer via pedido de cliente (agendamento, CRM) | Alto — mata o modelo "1 dev, horas vagas" | Roadmap público de "não incluído no MVP", revisitar só após tração real |
| Modelagem de tenant errada na Fase 1 | Alto — retrabalho caro | Revisão cuidadosa antes de avançar para Fase 2 |
| Dependência de terceiro (Vercel/Neon/Cloudflare) mudar preços | Médio | Stack escolhida é portável (Postgres padrão, Next.js roda em qualquer Node host) — troca de provedor é possível sem reescrever a aplicação |
| Cliente configurar DNS errado | Baixo-médio | Painel deve mostrar status claro de verificação + instruções específicas por provedor comum (Registro.br, GoDaddy, Cloudflare) |
| Falta de tempo (projeto solo, horas vagas) | Alto | Fases pequenas e sequenciais, cada uma entregando valor demonstrável — evita "meses sem nada visível" |

---

Este documento cobre da concepção ao primeiro cliente em produção, sem código, conforme solicitado. Ele pode servir como documentação oficial de referência ao longo do desenvolvimento — recomendo revisitá-lo ao final de cada fase do roadmap para confirmar que as decisões seguem válidas conforme o produto avança.
