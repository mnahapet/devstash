# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md


## Rules

- **Page files (`page.tsx`) must always be server components** — never add `'use client'` to a page file. When a page needs interactive UI or a form, extract it into a client component under `src/components/[feature]/` and import it from the server page.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```


