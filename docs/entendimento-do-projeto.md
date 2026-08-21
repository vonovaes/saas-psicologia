# Entendimento do Projeto — SaaS para Psicólogos

> Documento vivo de entendimento construído durante as conversas. Neste momento, o foco é somente alinhar o produto e suas decisões; não há implementação em andamento.

## 1. Objetivo do produto

Criar um SaaS multi-tenant para psicólogos gerarem contatos de potenciais pacientes por meio de uma landing page profissional e orientada à conversão, principalmente como destino de campanhas de Google Ads.

O valor vendido não é um construtor de sites: é uma presença digital simples, rápida e focada em transformar visitas em contatos pelo WhatsApp ou formulário.

## 2. Público e proposta de valor

- Público inicial: psicólogos que precisam de uma página própria para captação de pacientes.
- Cada cliente possui conteúdo, identidade básica, tracking e domínio próprios.
- A plataforma mantém um único modelo visual de landing page, parametrizado pelos dados de cada psicólogo.
- A principal métrica do produto é conversão de visita em contato, não quantidade de funcionalidades.

## 3. Escopo inicial

### Incluído

- Landing page pública por psicólogo.
- Domínio personalizado com HTTPS/SSL automatizado.
- Painel para o psicólogo editar os dados da própria página.
- Perfil profissional: nome, CRP, especialidades, cidade, descrição, foto, endereço, WhatsApp, Instagram e mapa.
- FAQ editável.
- Captura de leads por formulário e CTA de WhatsApp.
- Integrações de analytics por cliente: GTM, GA4, Google Ads e Meta Pixel opcional.
- Isolamento de dados entre clientes.
- Requisitos básicos de segurança, privacidade e LGPD.

### Explicitamente fora do MVP

- CRM.
- Blog ou CMS genérico.
- Editor visual de páginas.
- Agendamento.
- Recursos de IA.
- Vários templates de landing page.
- Dashboard avançado de métricas.

Pedidos desse tipo devem ser registrados para avaliação futura, mas não incorporados automaticamente ao MVP.

## 4. Experiência da landing page

A página deve ser mobile-first, rápida, acessível e centrada em um CTA principal: entrar em contato pelo WhatsApp.

Ordem prevista das seções:

1. Hero com foto, nome, especialidade e CTA.
2. Credibilidade: CRP, experiência e abordagem.
3. Especialidades ou público atendido.
4. Apresentação humana do profissional.
5. Como funciona o atendimento.
6. Localização/mapa quando houver atendimento presencial.
7. FAQ.
8. CTA final e botão flutuante de WhatsApp.

O tom deve ser acolhedor e claro, evitando jargão clínico excessivo. Depoimentos identificáveis de pacientes não são previstos, por sensibilidade ética e regulatória.

## 5. Arquitetura de produto

O produto será multi-tenant: vários psicólogos usam a mesma aplicação, mas cada um enxerga exclusivamente seus próprios dados e publica uma página distinta.

### Isolamento de tenants

- Estratégia definida: banco compartilhado e schema compartilhado, com `tenantId` obrigatório nas entidades.
- O tenant será identificado pelo domínio/host da requisição.
- O acesso ao banco deve passar por uma camada que obrigue o filtro por `tenantId`, evitando vazamentos por erro humano.
- O painel deve checar que o `tenantId` da sessão corresponde ao recurso acessado.

Essa abordagem é adequada para o estágio inicial e reduz a complexidade de operar vários bancos ou schemas.

### Entidades conceituais

- `tenants`: cadastro e status do psicólogo/cliente.
- `domains`: domínios do cliente, estado de DNS/SSL e domínio primário.
- `tenant_settings`: configurações de contato, mapa e tracking.
- `tenant_profile`: conteúdo principal da landing page.
- `faqs`: perguntas e respostas ordenáveis.
- `leads`: contatos recebidos pela página.
- `users`: credenciais de acesso ao painel.
- `audit_logs`: registro de ações administrativas sensíveis.

## 6. Stack e infraestrutura previstas

| Área | Decisão atual |
|---|---|
| Aplicação | Next.js com TypeScript e App Router |
| Estilos | Tailwind CSS |
| ORM | Prisma |
| Banco | PostgreSQL gerenciado, inicialmente Neon |
| Hospedagem da aplicação | Vercel |
| Imagens | Cloudflare R2 ou Vercel Blob — decisão a confirmar |
| Autenticação | Auth.js com e-mail/senha e hash seguro |
| Domínios e SSL | Vercel Domains API no MVP |
| Cache/rate limit futuro | Upstash Redis, se necessário |

O objetivo dessas escolhas é reduzir ao máximo a operação manual de infraestrutura para um desenvolvimento solo em horas vagas.

## 7. Domínios personalizados

Domínio por cliente é uma capacidade central, mas não será implementado com certificados e proxy gerenciados manualmente.

Fluxo esperado:

1. O psicólogo informa o domínio no painel.
2. O sistema registra o domínio no projeto hospedado.
3. O painel mostra as instruções de DNS necessárias.
4. O provedor valida o DNS e emite/renova o SSL automaticamente.
5. A aplicação usa o host da requisição para servir os dados do tenant correto.

Vercel Domains API é a escolha inicial. Cloudflare for SaaS é uma alternativa futura caso a infraestrutura deixe de usar Vercel.

## 8. Painel administrativo

O painel terá escopo restrito à manutenção da landing page:

- Login.
- Meu perfil.
- FAQ.
- Domínio e status de configuração DNS/SSL.
- IDs de analytics.

Não será incluído um dashboard complexo de métricas no início. Leads podem ser armazenados desde o MVP, mas sua visualização detalhada não é requisito inicial.

## 9. Analytics e conversões

Cada tenant terá suas próprias identificações de tracking, armazenadas isoladamente e injetadas somente na sua landing page.

Eventos previstos:

- `click_whatsapp`
- `form_submit`
- `click_maps`
- `page_view`

Os eventos serão enviados ao `dataLayer` para que o GTM de cada cliente faça a configuração de GA4, Google Ads e, opcionalmente, Meta Pixel.

## 10. Segurança e LGPD

- Leads contêm dados pessoais e exigem política de privacidade e consentimento explícito no formulário.
- Deve existir procedimento/rota interna para exclusão de dados sob solicitação.
- Login e formulário público devem ter rate limiting.
- Uploads devem validar tipo real e tamanho do arquivo, com envio direto ao storage por URL assinada.
- Senhas devem usar hash forte; erros internos e stack traces não devem ser expostos ao usuário.
- Ações administrativas relevantes devem ser auditáveis.
- Cabeçalhos de segurança e proteção contra acessos indevidos entre tenants são requisitos de lançamento.

## 11. Fases previstas

1. Fundação técnica: repositório, stack, banco, deploy e verificações básicas.
2. Dados e resolução de tenant: schema, domínio/host e isolamento de acesso.
3. Autenticação e painel básico.
4. Landing page de conversão com dados reais.
5. Domínio próprio e SSL automatizado.
6. Analytics e tracking.
7. Segurança, LGPD e preparação para produção.
8. Soft launch com 2 a 5 clientes e onboarding inicialmente manual.

## 12. Critérios de sucesso iniciais

- Dois ou mais tenants funcionam simultaneamente sem expor dados entre si.
- Um cliente consegue editar os dados básicos e vê-los refletidos na landing page.
- Pelo menos um domínio real funciona com HTTPS sem gestão manual de certificado.
- Cliques de WhatsApp e envios de formulário são rastreáveis no ambiente de analytics do cliente.
- Um cliente piloto recebe leads reais via campanhas.

## 13. Pontos a decidir durante o detalhamento

- Nome, domínio raiz e posicionamento comercial da plataforma.
- Modelo de cobrança, planos e política de trial.
- Se o formulário será exibido além do WhatsApp em todas as páginas e como os leads serão notificados ao psicólogo.
- Provedor definitivo de storage: R2 ou Vercel Blob.
- Requisitos exatos de onboarding, suporte e configuração de DNS para os primeiros clientes.
- Conteúdo e responsabilidade da política de privacidade, termos de uso e fluxo de exclusão de dados.
- Campos obrigatórios e opcionais do perfil, conforme necessidades reais e regras profissionais aplicáveis.

## 14. Princípios de decisão

Uma nova funcionalidade entra no produto apenas se atender pelo menos um destes critérios:

- aumenta de modo plausível a conversão;
- reduz custo operacional ou suporte;
- é indispensável para publicar e administrar a landing page do psicólogo;
- atende a uma necessidade legal, de segurança ou privacidade.

Caso contrário, deve permanecer fora do MVP.

## 15. Plano para os diagramas de arquitetura

Os diagramas serão criados no draw.io. Para manter a documentação clara e não transformar um único desenho em algo ilegível, a arquitetura deve ser representada em três visões complementares.

### Diagrama A — Visão geral de produção

Este é o desenho principal, voltado a explicar como usuários, serviços externos e a aplicação se conectam.

Elementos:

- Visitante da landing page.
- Psicólogo/administrador do painel.
- Domínio próprio do psicólogo e domínio do painel da plataforma.
- Vercel, hospedando a aplicação Next.js e gerenciando HTTPS dos domínios dos clientes.
- Aplicação Next.js: middleware de resolução de tenant, landing page pública, painel administrativo e rotas/ações de backend.
- Auth.js para sessão e autenticação do painel.
- Neon/PostgreSQL para dados multi-tenant.
- Storage de imagens (R2 ou Vercel Blob; indicado como decisão pendente até a escolha definitiva).
- Google Tag Manager e ferramentas de analytics do cliente.
- WhatsApp e formulário de contato como destinos de conversão.

Fluxos essenciais a desenhar:

1. O visitante acessa o domínio do psicólogo.
2. A Vercel encaminha a requisição à aplicação.
3. O middleware lê o host e resolve o tenant.
4. A landing page consulta apenas os dados daquele tenant no PostgreSQL.
5. O visitante clica no WhatsApp ou envia um formulário; o evento é enviado ao `dataLayer` e/ou o lead é salvo no banco.
6. O psicólogo acessa o painel, autentica-se e altera somente seus próprios dados.
7. Fotos são enviadas diretamente ao storage por URL pré-assinada; a aplicação guarda apenas a referência do arquivo.

### Diagrama B — Fluxo interno da requisição e isolamento de tenant

Este desenho detalha o principal ponto de segurança do produto.

Sequência:

`Requisição HTTP` → `Middleware: Host` → `Resolução do tenant` → `Rota/Server Component ou Route Handler` → `Validação (Zod)` → `Service` → `Repository com tenantId obrigatório` → `Prisma` → `PostgreSQL`.

Regras que devem aparecer como anotações no desenho:

- O `tenantId` é obtido a partir do host (página pública) ou sessão (painel) e precisa ser conferido entre esses contextos quando aplicável.
- O Prisma não deve ser chamado diretamente pelas rotas.
- Toda consulta de recurso específico deve ser filtrada por `tenantId`.
- Falhas de domínio desconhecido, tenant suspenso ou acesso cruzado devem ser bloqueadas antes de expor dados.

### Diagrama C — Onboarding de domínio personalizado

Este desenho descreve a operação que conecta um novo psicólogo ao produto.

Sequência:

1. Psicólogo informa o domínio no painel.
2. Backend registra o domínio na Vercel Domains API.
3. O sistema grava o domínio e seu status como pendente no PostgreSQL.
4. O painel mostra os registros DNS a configurar.
5. O psicólogo configura DNS no provedor do domínio.
6. A Vercel valida o DNS e emite SSL automaticamente.
7. O status muda para ativo e o domínio passa a servir a landing page correta.

### Convenções visuais sugeridas

- Use cores por responsabilidade: azul para usuários e navegadores, roxo para aplicação, verde para dados/storage, laranja para integrações externas e cinza para infraestrutura/DNS.
- Diferencie chamadas síncronas (linha contínua) de tracking, upload ou verificação assíncrona (linha tracejada).
- Mostre o limite de confiança entre internet, aplicação e dados com contêineres/grupos visuais.
- Evite desenhar tabelas e campos neste estágio; o diagrama deve explicar responsabilidades e fluxo, não substituir o schema do banco.

### Ordem recomendada de elaboração

1. Criar o Diagrama A e validar se ele comunica a visão completa em uma leitura rápida.
2. Desenhar o Diagrama B para validar isolamento, autorização e responsabilidades do backend antes de implementar.
3. Desenhar o Diagrama C para tornar o onboarding de domínio executável e fácil de suportar.
4. Depois, caso necessário, criar um diagrama separado de modelo de dados (ERD), mantendo-o fora do desenho de infraestrutura.

## 16. Decisões técnicas confirmadas para o MVP

Estas decisões priorizam baixo custo operacional, implementação rápida e evitam modelagem prematura. Elas devem orientar o schema Prisma e a implementação inicial.

### Especialidades

- As especialidades serão armazenadas no `tenant_profile` como uma lista de textos (`String[]` no PostgreSQL/Prisma).
- Não haverá tabela de especialidades no MVP, pois não existe catálogo compartilhado, busca por especialidade ou relatório que justifique a normalização.
- Se futuramente for necessário filtrar profissionais ou padronizar termos, essa lista poderá ser migrada para tabelas relacionais sem alterar a experiência pública.

### Usuários e permissões

- Um tenant pode ter vários usuários desde a modelagem inicial (`tenants` 1:N `users`).
- O onboarding inicial criará um único usuário com papel `owner`.
- O papel `admin` fica previsto para evolução futura; não é necessário construir tela de gestão de equipe no MVP.
- Toda sessão deve carregar `userId`, `tenantId` e `role`.

### Leads e WhatsApp

- Apenas envios do formulário criam registros na tabela `leads`.
- Clique no WhatsApp não cria lead no banco: ele é um evento de conversão (`click_whatsapp`) enviado ao `dataLayer`/GTM.
- Portanto, no MVP, `leads.origem` terá apenas o valor `formulario`. O campo pode ser mantido para permitir futuras origens sem migration estrutural.
- O formulário deve registrar data/hora do consentimento de privacidade junto ao lead.

### Estados de tenant e domínio

- `tenant.status`: `TRIAL`, `ACTIVE`, `SUSPENDED`.
- `domain.dnsStatus`: `PENDING`, `VERIFIED`, `ERROR`.
- `domain.sslStatus`: `PENDING`, `ACTIVE`, `ERROR`.
- Uma falha de configuração não exclui o domínio automaticamente; ela permanece registrada com estado `ERROR` e uma mensagem operacional para correção.
- O domínio público só deve servir a landing page quando o tenant estiver `ACTIVE` ou `TRIAL` e o domínio estiver com DNS verificado e SSL ativo.

### Storage de imagens

- O MVP usará **Vercel Blob** para fotos e demais arquivos públicos pequenos.
- Motivo: integração mais simples com Next.js/Vercel e menor esforço de operação no momento em que haverá poucas imagens por tenant.
- O acesso ao storage deve ser encapsulado em uma interface de serviço; assim, uma migração futura para Cloudflare R2 não exigirá alterar componentes ou regras de negócio.

### Exclusão e auditoria

- `tenants`, `domains`, `users`, `faqs` e `leads` terão `deletedAt` para soft delete.
- `audit_logs` é somente de inclusão: registros de auditoria não devem ser alterados ou excluídos pelo fluxo normal da aplicação.
- Ações que precisam gerar auditoria no MVP: mudanças de domínio, alterações de perfil, alterações de analytics e eventos de acesso administrativo relevantes.

## 17. Forma de trabalho e pré-requisitos locais

O desenvolvimento será feito de forma guiada, com mudanças pequenas e verificáveis: em cada etapa será explicado o objetivo, realizada a alteração, executada uma verificação e registrado o resultado relevante neste documento.

### Estado atual do ambiente

- Node.js `v22.13.0` está instalado.
- A instalação global do npm está com o prefixo configurado incorretamente para uma cópia em `AppData`, o que impede o comando `npm` de funcionar normalmente.
- O npm incluído com o Node está presente e funcional quando executado com o prefixo correto; portanto, isso não bloqueia a criação do projeto.
- Antes do uso cotidiano do ambiente, a ação recomendada é reinstalar o Node.js em versão LTS para restaurar a configuração padrão do npm. Essa ação altera o ambiente global da máquina e será feita apenas com confirmação explícita.

### Andamento da Fase 0

- Foi criado o projeto Next.js em `saas-psicologos/`, com Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, ESLint e App Router.
- A estrutura utiliza `src/` e o alias de importação `@/*`.
- As dependências foram instaladas e a verificação inicial do ESLint foi concluída sem erros.
- O projeto possui repositório Git local, sem commits e sem remoto configurado.
- Os documentos de planejamento e o arquivo draw.io ainda estão na pasta pai. Antes do primeiro commit, eles devem ser movidos para uma pasta `docs/` dentro do repositório ou o repositório deve ser criado na pasta pai, conforme a organização que for escolhida.
