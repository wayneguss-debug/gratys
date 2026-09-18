# Campus Agora — nome provisório

Primeira implementação do portal acadêmico desenvolvido pela **GRATYS TECH** para o contexto do IFMT Campus Cáceres.

> **Importante:** GRATYS TECH é o nome da empresa/equipe, não do site. **Campus Agora** é apenas um placeholder até a definição do nome oficial.

## Objetivo

Centralizar informações úteis para alunos e servidores, seguindo o documento do Projeto Integrador:

- informativos semanais e novidades do campus;
- calendário de eventos e prazos;
- orientações sobre regras e funcionamento institucional;
- avisos sobre alterações relevantes;
- apoio à localização de salas e setores;
- espaço preparado para horários de transporte;
- comunicação simples, acessível e confiável.

O portal é um **projeto acadêmico independente** e não deve ser confundido com um canal oficial do IFMT.

## Stack atual

- HTML5, CSS3 e JavaScript;
- Supabase (PostgreSQL + REST API + RLS);
- configuração pronta para hospedagem estática na Vercel.

A primeira versão foi mantida leve para priorizar desempenho, responsividade e facilidade de evolução.

## Banco de dados

Projeto Supabase: `jbwrnvmidjvcnkexjsqj`

Tabelas iniciais:

- `posts`
- `events`
- `campus_locations`
- `transport_schedules`

Todas estão com **Row Level Security (RLS)** ativado. Visitantes só conseguem consultar conteúdo publicado/ativo.

## Estrutura atual

```
/
├── index.html
├── styles.css
├── app.js
├── vercel.json
└── supabase/
    └── schema.sql
```

## Estado da primeira versão

Já implementado:

- página inicial responsiva;
- seção de informativos conectada ao Supabase;
- busca de notícias/avisos;
- agenda de eventos e prazos;
- orientações;
- guia de salas e setores;
- área de transporte;
- identidade provisória;
- aviso explícito de que não é canal oficial do IFMT;
- estados vazios para impedir exibição de informações inventadas;
- RLS e políticas de leitura/escrita administrativa.

## Próximas etapas

1. cadastrar informações reais de eventos, salas, setores e transporte;
2. criar painel administrativo autenticado;
3. criar fluxo de publicação e revisão;
4. definir nome e identidade visual oficiais;
5. integrar Instagram quando a conta do projeto estiver definida;
6. criar páginas individuais para notícias e orientações;
7. configurar domínio e deploy de produção.

## Equipe — GRATYS TECH

- Thaís — Organizadora e Analista (chefe)
- Sophia — Codificadora
- Grasyella — Codificadora
- Rafaella — Informante
- Yasmin — Informante
- Andressa — Mídia e Design

Projeto Integrador — 14/08/2026.
