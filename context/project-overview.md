# DevStash — Project Overview

> A fast, searchable, AI-enhanced hub for all developer knowledge & resources.

---

## Problem

Developers keep their essentials scattered across multiple tools:

| Resource | Typical Location |
|---|---|
| Code snippets | VS Code, Notion |
| AI prompts | Chat histories |
| Context files | Buried in project folders |
| Useful links | Browser bookmarks |
| Docs & notes | Random folders |
| Commands | `.txt` files, bash history |
| Templates | GitHub Gists |

This leads to **context switching**, **lost knowledge**, and **inconsistent workflows**. DevStash consolidates everything into one place.

---

## Target Users

- **Everyday Developer** — Needs fast access to snippets, prompts, commands, and links.
- **AI-first Developer** — Saves prompts, contexts, workflows, and system messages.
- **Content Creator / Educator** — Stores code blocks, explanations, and course notes.
- **Full-stack Builder** — Collects patterns, boilerplates, and API examples.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 / React 19 (SSR + API routes) |
| Language | TypeScript |
| Database | Neon (PostgreSQL) |
| ORM | Prisma 7 |
| Cache | Redis *(TBD)* |
| File Storage | Cloudflare R2 |
| Auth | NextAuth v5 (Email/password + GitHub OAuth) |
| AI | OpenAI `gpt-5-nano` |
| Styling | Tailwind CSS v4 + ShadCN UI |
| Payments | Stripe |

> ⚠️ **Database rule:** Never use `db push`. Always create migrations that run in dev first, then prod.

---

## Data Models

### Prisma Schema

```prisma
model User {
  id                     String    @id @default(cuid())
  email                  String    @unique
  name                   String?
  image                  String?
  isPro                  Boolean   @default(false)
  stripeCustomerId       String?
  stripeSubscriptionId   String?
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]

  // NextAuth relations
  accounts Account[]
  sessions Session[]
}

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet" | "prompt" | "note" | "command" | "file" | "image" | "link"
  icon     String
  color    String
  isSystem Boolean @default(false)

  userId String? // null for system types
  user   User?   @relation(fields: [userId], references: [id])

  items Item[]
}

model Item {
  id          String   @id @default(cuid())
  title       String
  contentType String   // "text" | "file" | "url"
  content     String?  // text content (null if file)
  fileUrl     String?  // Cloudflare R2 URL (null if text)
  fileName    String?
  fileSize    Int?
  url         String?  // for link types
  description String?
  language    String?  // for code snippets
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastUsedAt  DateTime?

  userId     String
  user       User     @relation(fields: [userId], references: [id])
  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        Tag[]            @relation("ItemTags")
  collections ItemCollection[]
}

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)
  defaultTypeId String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id])

  items ItemCollection[]
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id])
  collection Collection @relation(fields: [collectionId], references: [id])

  @@id([itemId, collectionId])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  items Item[] @relation("ItemTags")
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│                  Next.js App                │
│                                             │
│  ┌─────────────┐      ┌──────────────────┐  │
│  │  React UI   │      │   API Routes     │  │
│  │  (RSC/CSR)  │◄────►│  /api/items      │  │
│  └─────────────┘      │  /api/collections│  │
│                        │  /api/ai         │  │
│                        │  /api/upload     │  │
│                        └────────┬─────────┘  │
└─────────────────────────────────│────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
   ┌──────▼──────┐       ┌────────▼───────┐      ┌───────▼───────┐
   │ Neon (PG)   │       │ Cloudflare R2  │      │  OpenAI API   │
   │ via Prisma  │       │ (file uploads) │      │  gpt-5-nano   │
   └─────────────┘       └────────────────┘      └───────────────┘
```

---

## Item Types

Items belong to one of these types. System types are read-only; custom types (Pro) will come later.

| Type | Color | Icon | Content Type | Route |
|---|---|---|---|---|
| Snippet | `#3b82f6` blue | `Code` | text | `/items/snippets` |
| Prompt | `#8b5cf6` purple | `Sparkles` | text | `/items/prompts` |
| Note | `#fde047` yellow | `StickyNote` | text | `/items/notes` |
| Command | `#f97316` orange | `Terminal` | text | `/items/commands` |
| Link | `#10b981` emerald | `Link` | url | `/items/links` |
| File *(Pro)* | `#6b7280` gray | `File` | file | `/items/files` |
| Image *(Pro)* | `#ec4899` pink | `Image` | file | `/items/images` |

---

## Features

### Core

- **Items** — Create, read, update, and delete items of any type; open in a slide-out drawer.
- **Collections** — Group items into named collections; items can belong to many collections.
- **Search** — Full-text search across title, content, tags, and type.
- **Tags** — Add multiple tags per item; filter by tag.
- **Favorites** — Star collections and items.
- **Pinning** — Pin items to the top of any view.
- **Recently Used** — Track `lastUsedAt` to surface recent items.
- **Markdown Editor** — Rich editing for text-type items with syntax highlighting.
- **Import** — Import code from a file directly into a snippet.
- **Export** *(Pro)* — Export all data as JSON or ZIP.
- **Dark Mode** — Default; light mode toggle available.

### AI Features (Pro only)

| Feature | Description |
|---|---|
| Auto-tagging | Suggests tags based on item content |
| Summaries | Generates a short description for any item |
| Explain This Code | Step-by-step explanation of a snippet |
| Prompt Optimizer | Rewrites and improves AI prompts |

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (collapsible)    │  Main Content               │
│                           │                             │
│  ▸ Snippets               │  Collections Grid           │
│  ▸ Prompts                │  ┌──────┐ ┌──────┐          │
│  ▸ Commands               │  │React │ │Python│ ...      │
│  ▸ Notes                  │  └──────┘ └──────┘          │
│  ▸ Files                  │                             │
│  ▸ Images                 │  Items (color-coded cards)  │
│  ▸ Links                  │  ┌──────────────────────┐   │
│  ─────────────            │  │ snippet  title here  │   │
│  Collections              │  └──────────────────────┘   │
│  ▸ React Patterns         │  ┌──────────────────────┐   │
│  ▸ Interview Prep         │  │ prompt   title here  │   │
│  ▸ Context Files          │  └──────────────────────┘   │
│                           │                             │
│  [Mobile: sidebar → drawer]                             │
└─────────────────────────────────────────────────────────┘

                    Item opens in drawer →
                    ┌───────────────────────────┐
                    │  [Type badge]  Title      │
                    │  ─────────────────────    │
                    │  Content / code block     │
                    │                           │
                    │  Tags: react, hooks       │
                    │  Collections: React, Prep │
                    │  [Copy] [Edit] [Delete]   │
                    └───────────────────────────┘
```

---

## Authentication

Provided by **NextAuth v5**:

- Email + password
- GitHub OAuth

User sessions extend the base NextAuth `User` with `isPro`, `stripeCustomerId`, and `stripeSubscriptionId`.

---

## Monetization

### Free Tier

- 50 items total
- 3 collections
- All system types except File & Image
- Basic search
- No AI features
- No file uploads

### Pro — $8/month or $72/year

- Unlimited items & collections
- File & Image uploads (via Cloudflare R2)
- Custom item types *(later)*
- All AI features
- Export (JSON / ZIP)
- Priority support

> 💡 During development, all users have full Pro access.

---

## URL Structure

```
/                          → Dashboard / home
/items/snippets            → All snippets
/items/prompts             → All prompts
/items/commands            → All commands
/items/notes               → All notes
/items/links               → All links
/items/files               → All files (Pro)
/items/images              → All images (Pro)
/collections               → All collections
/collections/[id]          → Single collection view
/search?q=...              → Search results
/settings                  → User settings, export, billing
```

---

## Key References

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma 7 Docs](https://www.prisma.io/docs)
- [NextAuth v5 Docs](https://authjs.dev)
- [Neon Postgres](https://neon.tech/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Stripe Docs](https://stripe.com/docs)

---

*Last updated: May 2026*
