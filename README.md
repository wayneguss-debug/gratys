# Mural do Campus — nome provisório

Portal acadêmico desenvolvido pela **GRATYS TECH** para o Projeto Integrador no contexto do IFMT Campus Cáceres.

> **GRATYS TECH é o nome da empresa/equipe.** O nome do site ainda não foi definido; “Mural do Campus” é apenas um placeholder administrável pelo painel.

## Objetivo

Centralizar informações úteis para alunos e servidores:

- informativos semanais e novidades;
- eventos, prazos e processos seletivos;
- orientações institucionais em linguagem direta;
- alterações de horário e avisos importantes;
- localização de salas, setores e serviços;
- horários de transporte confirmados;
- comunicação organizada, acessível e verificável.

O portal é um **projeto acadêmico independente** e não deve ser confundido com um canal oficial do IFMT.

## Stack v2

- Next.js 16.3.5 (App Router)
- React 19.3.0
- TypeScript
- Supabase Auth + PostgreSQL + Storage + RLS
- Server Components e Server Actions
- Vercel como alvo de deploy

As dependências são versionadas de forma fixa. O CI gera/valida o lockfile e executa typecheck + build.

## Páginas públicas

- / — mural editorial dinâmico
- /informativos — arquivo com busca
- /informativos/[slug] — página individual
- /agenda — eventos e prazos
- /campus — salas, setores e transporte
- /sitemap.xml e /robots.txt

## Autenticação

- /auth/login — login e cadastro
- /auth/check-email — instrução de verificação
- /auth/confirm — confirmação SSR por token hash/código
- /auth/recovery — recuperação de senha
- /auth/update-password — atualização segura da senha

Papéis:

- viewer — conta comum, sem painel editorial
- editor — gerencia conteúdo, agenda, campus e mídia
- admin — editor + configurações do portal

A conta wayneguss65@gmail.com é promovida a admin somente após a confirmação do e-mail.

## Painel editorial

- /admin — visão geral
- /admin/posts — publicar, despublicar, editar e excluir informativos
- /admin/posts/new — compositor
- /admin/events — agenda
- /admin/campus — locais e transporte
- /admin/media — upload de imagens para Supabase Storage
- /admin/settings — nome, tagline, descrição e links do portal

O painel é protegido no servidor e as permissões também são aplicadas pelo PostgreSQL/RLS. O frontend não é a barreira de segurança.

## Banco de dados

Projeto Supabase: jbwrnvmidjvcnkexjsqj

Tabelas:

- profiles
- site_settings
- posts
- events
- campus_locations
- transport_schedules

Bucket:

- media — público para leitura e restrito a editores/admins para escrita

O Security Advisor está sem alertas. Todas as tabelas expostas usam RLS.

## E-mails

Templates versionados:

- supabase/templates/confirmation.html
- supabase/templates/recovery.html
- supabase/templates/invite.html

Como este é um projeto Supabase Free criado depois de 3 de junho de 2026, os templates personalizados só poderão ser ativados com **SMTP próprio**. Até lá, os arquivos servem como fonte versionada da identidade de e-mail.

## Variáveis de ambiente

Crie .env.local com base em .env.example e preencha:

NEXT_PUBLIC_SUPABASE_URL=https://jbwrnvmidjvcnkexjsqj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

Nunca use service_role ou chave secreta em variável NEXT_PUBLIC_*.

## Equipe — GRATYS TECH

- Thaís — Organizadora e Analista (chefe)
- Sophia — Codificadora
- Grasyella — Codificadora
- Rafaella — Informante
- Yasmin — Informante
- Andressa — Mídia e Design

Projeto Integrador — 14/08/2026.
