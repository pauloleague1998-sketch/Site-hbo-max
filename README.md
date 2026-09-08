# Streamflix

Site para salvar e organizar filmes, com interface estilo Netflix e painel administrativo para gerenciar participantes.

## Tecnologias

- React + Vite
- Tailwind CSS
- Lucide React (ícones)
- React Router (navegação)

## Instalação

```bash
npm install
```

## Rodar em desenvolvimento

```bash
npm run dev
```

Depois acesse a URL exibida no terminal (normalmente http://localhost:5173).

## Build de produção

```bash
npm run build
```

## Estrutura

- `src/components/` — componentes reutilizáveis (Navbar, Hero, CardFilme, Carrossel, ModalFilme, AdminPanel).
- `src/data/filmes.js` — dados mockados dos filmes/séries.
- `src/pages/` — páginas Home e Admin.
- Rota `/admin` — painel para gerenciar participantes.

## Objetivo

O objetivo do site é salvar filmes favoritos como lista pessoal, navegar por um catálogo visual e permitir que um administrador gerencie participantes. A estrutura está pronta para integração futura com um backend de autenticação e banco de dados.
