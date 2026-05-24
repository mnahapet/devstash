import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, ContentType } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ============================================
// SYSTEM ITEM TYPES
// ============================================
const systemItemTypes = [
  { name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { name: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { name: "link", icon: "Link", color: "#10b981", isSystem: true },
];

// ============================================
// SEED DATA
// ============================================
async function main() {
  console.log("Seeding system item types...");
  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });
    if (!existing) {
      await prisma.itemType.create({ data: type });
    }
  }

  // Fetch type records for use below
  const types = await prisma.itemType.findMany({ where: { isSystem: true } });
  const typeMap = Object.fromEntries(types.map((t) => [t.name, t]));

  // ============================================
  // DEMO USER
  // ============================================
  console.log("Seeding demo user...");
  const hashedPassword = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // ============================================
  // COLLECTION: React Patterns
  // ============================================
  console.log("Seeding React Patterns collection...");
  const reactCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-react" },
    update: {},
    create: {
      id: "seed-collection-react",
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
      defaultTypeId: typeMap.snippet.id,
    },
  });

  const reactItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-react-1" },
      update: {},
      create: {
        id: "seed-item-react-1",
        title: "Custom Hooks Collection",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `import { useState, useEffect, useCallback, useRef } from 'react';

// useDebounce — delays updating a value until after a pause in changes
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// useLocalStorage — synced state persisted to localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  return [stored, setValue] as const;
}

// usePrevious — tracks the previous render's value
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });
  return ref.current;
}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-react-2" },
      update: {},
      create: {
        id: "seed-item-react-2",
        title: "Context Provider Pattern",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// Compound component pattern
export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border p-4">{children}</div>;
}
Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2 font-semibold">{children}</div>;
};
Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
};`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-react-3" },
      update: {},
      create: {
        id: "seed-item-react-3",
        title: "Utility Functions",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// cn — merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatDate — locale-aware date formatter
export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  }).format(new Date(date));
}

// truncate — shorten a string with ellipsis
export function truncate(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength - 1) + '…' : str;
}

// sleep — promisified setTimeout for async flows
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// groupBy — group an array of objects by a key
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key]);
    (acc[group] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}`,
      },
    }),
  ]);

  await Promise.all(
    reactItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: reactCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: reactCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: AI Workflows
  // ============================================
  console.log("Seeding AI Workflows collection...");
  const aiCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-ai" },
    update: {},
    create: {
      id: "seed-collection-ai",
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
      defaultTypeId: typeMap.prompt.id,
    },
  });

  const aiItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-ai-1" },
      update: {},
      create: {
        id: "seed-item-ai-1",
        title: "Code Review Prompt",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.prompt.id,
        content: `You are a senior software engineer conducting a thorough code review. Review the following code and provide feedback on:

1. **Correctness** — Are there any bugs, edge cases, or logic errors?
2. **Security** — Any vulnerabilities (injection, auth bypass, data exposure)?
3. **Performance** — N+1 queries, unnecessary re-renders, memory leaks?
4. **Readability** — Is the code easy to understand? Are names clear?
5. **Patterns** — Does it follow the existing codebase conventions?

Be specific. Reference line numbers where possible. Distinguish between blocking issues and suggestions.

Code to review:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-ai-2" },
      update: {},
      create: {
        id: "seed-item-ai-2",
        title: "Documentation Generator",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.prompt.id,
        content: `Generate concise, developer-friendly documentation for the following function or module.

Include:
- **Purpose** — What does it do in one sentence?
- **Parameters** — Name, type, description, whether optional
- **Returns** — Type and description
- **Throws** — Any errors it may throw
- **Example** — A minimal, realistic usage example

Keep descriptions short. Avoid restating the code. Focus on WHY and WHEN to use it, not WHAT it does line by line.

Code:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-ai-3" },
      update: {},
      create: {
        id: "seed-item-ai-3",
        title: "Refactoring Assistant",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.prompt.id,
        content: `Refactor the following code to improve readability and maintainability without changing its behaviour.

Guidelines:
- Extract magic numbers and strings into named constants
- Break functions longer than ~30 lines into smaller, named helpers
- Replace imperative loops with expressive array methods where it reads more clearly
- Remove unnecessary comments — rename things instead
- Apply early returns to reduce nesting

Show the refactored code and briefly explain each significant change (one line per change).

Original code:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
      },
    }),
  ]);

  await Promise.all(
    aiItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: aiCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: aiCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: DevOps
  // ============================================
  console.log("Seeding DevOps collection...");
  const devopsCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-devops" },
    update: {},
    create: {
      id: "seed-collection-devops",
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
      defaultTypeId: typeMap.snippet.id,
    },
  });

  const devopsItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-devops-1" },
      update: {},
      create: {
        id: "seed-item-devops-1",
        title: "GitHub Actions CI — Node.js",
        contentType: ContentType.TEXT,
        language: "yaml",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-devops-2" },
      update: {},
      create: {
        id: "seed-item-devops-2",
        title: "Deploy to Production",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `# Run migrations then restart the app (zero-downtime via pm2)
npx prisma migrate deploy && pm2 reload ecosystem.config.js --env production`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-devops-3" },
      update: {},
      create: {
        id: "seed-item-devops-3",
        title: "Docker Documentation",
        contentType: ContentType.URL,
        url: "https://docs.docker.com/get-started/",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-devops-4" },
      update: {},
      create: {
        id: "seed-item-devops-4",
        title: "GitHub Actions Docs",
        contentType: ContentType.URL,
        url: "https://docs.github.com/en/actions",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
  ]);

  await Promise.all(
    devopsItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: devopsCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: devopsCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: Terminal Commands
  // ============================================
  console.log("Seeding Terminal Commands collection...");
  const terminalCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-terminal" },
    update: {},
    create: {
      id: "seed-collection-terminal",
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
      defaultTypeId: typeMap.command.id,
    },
  });

  const terminalItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-terminal-1" },
      update: {},
      create: {
        id: "seed-item-terminal-1",
        title: "Git Essentials",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Amend the last commit message without changing files
git commit --amend --only -m "new message"

# Interactively stage hunks
git add -p

# Show commits not yet pushed to remote
git log @{u}..

# Squash last N commits into one
git rebase -i HEAD~N`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-terminal-2" },
      update: {},
      create: {
        id: "seed-item-terminal-2",
        title: "Docker Commands",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `# Remove all stopped containers, unused networks, dangling images
docker system prune -f

# Tail logs for a running container
docker logs -f <container_name>

# Open a shell in a running container
docker exec -it <container_name> sh

# Build and tag an image
docker build -t myapp:latest .

# Run a container and remove it on exit
docker run --rm -it myapp:latest`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-terminal-3" },
      update: {},
      create: {
        id: "seed-item-terminal-3",
        title: "Process Management",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `# Find the process using a port
lsof -i :<port>          # macOS / Linux
netstat -ano | findstr :<port>  # Windows

# Kill process by PID
kill -9 <pid>            # macOS / Linux
taskkill /PID <pid> /F   # Windows

# Watch a command's output every 2 seconds
watch -n 2 <command>

# Show top CPU/memory processes
top -o cpu               # macOS
htop                     # Linux (install separately)`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-terminal-4" },
      update: {},
      create: {
        id: "seed-item-terminal-4",
        title: "Package Manager Utilities",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `# List outdated packages
npm outdated

# Check for security vulnerabilities
npm audit

# Install exact version and save to package.json
npm install <package>@<version> --save-exact

# Remove unused packages (not in package.json)
npm prune

# Show why a package is installed (dependency chain)
npm why <package>

# Run a local binary without global install
npx <package> [args]`,
      },
    }),
  ]);

  await Promise.all(
    terminalItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: terminalCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: terminalCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: Design Resources
  // ============================================
  console.log("Seeding Design Resources collection...");
  const designCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-design" },
    update: {},
    create: {
      id: "seed-collection-design",
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
      defaultTypeId: typeMap.link.id,
    },
  });

  const designItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-design-1" },
      update: {},
      create: {
        id: "seed-item-design-1",
        title: "Tailwind CSS Docs",
        contentType: ContentType.URL,
        url: "https://tailwindcss.com/docs",
        description: "Official Tailwind CSS documentation — utilities, configuration, and plugins.",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-design-2" },
      update: {},
      create: {
        id: "seed-item-design-2",
        title: "shadcn/ui Components",
        contentType: ContentType.URL,
        url: "https://ui.shadcn.com/docs/components",
        description: "Accessible, composable UI components built with Radix and Tailwind.",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-design-3" },
      update: {},
      create: {
        id: "seed-item-design-3",
        title: "Radix UI Primitives",
        contentType: ContentType.URL,
        url: "https://www.radix-ui.com/primitives/docs/overview/introduction",
        description: "Unstyled, accessible component primitives for building design systems.",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-design-4" },
      update: {},
      create: {
        id: "seed-item-design-4",
        title: "Lucide Icons",
        contentType: ContentType.URL,
        url: "https://lucide.dev/icons",
        description: "Searchable library of open-source SVG icons. Used throughout DevStash.",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
  ]);

  await Promise.all(
    designItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: designCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: designCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: TypeScript Utils
  // ============================================
  console.log("Seeding TypeScript Utils collection...");
  const tsCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-typescript" },
    update: {},
    create: {
      id: "seed-collection-typescript",
      name: "TypeScript Utils",
      description: "Reusable utility types and helper functions",
      userId: user.id,
      defaultTypeId: typeMap.snippet.id,
    },
  });

  const tsItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-ts-1" },
      update: {},
      create: {
        id: "seed-item-ts-1",
        title: "Utility Types Cheatsheet",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `// Partial — make all properties optional
type PartialUser = Partial<User>;

// Required — make all properties required
type RequiredConfig = Required<Config>;

// Pick — select specific keys
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;

// Omit — exclude specific keys
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Record — typed key-value map
type StatusMap = Record<string, boolean>;

// ReturnType — extract function return type
type FetchResult = ReturnType<typeof fetchUser>;

// Awaited — unwrap a Promise
type ResolvedData = Awaited<ReturnType<typeof fetchUser>>;

// NonNullable — remove null and undefined
type DefinedId = NonNullable<string | null | undefined>; // string`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-ts-2" },
      update: {},
      create: {
        id: "seed-item-ts-2",
        title: "Result Type Pattern",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `// Rust-inspired Result type for explicit error handling
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E = string> = Ok<T> | Err<E>;

function ok<T>(value: T): Ok<T> { return { ok: true, value }; }
function err<E>(error: E): Err<E> { return { ok: false, error }; }

async function fetchUser(id: string): Promise<Result<User>> {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return err(\`User \${id} not found\`);
  return ok(user);
}

const result = await fetchUser('123');
if (!result.ok) {
  console.error(result.error);
} else {
  console.log(result.value.name);
}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-ts-3" },
      update: {},
      create: {
        id: "seed-item-ts-3",
        title: "Type-Safe Event Emitter",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `type EventMap = {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'item:created': { itemId: string; title: string };
};

type EventKey = keyof EventMap;
type EventHandler<K extends EventKey> = (payload: EventMap[K]) => void;

class TypedEmitter {
  private handlers: { [K in EventKey]?: EventHandler<K>[] } = {};

  on<K extends EventKey>(event: K, handler: EventHandler<K>) {
    (this.handlers[event] ??= [] as EventHandler<K>[]).push(handler);
    return this;
  }

  emit<K extends EventKey>(event: K, payload: EventMap[K]) {
    this.handlers[event]?.forEach((h) => (h as EventHandler<K>)(payload));
  }
}

const emitter = new TypedEmitter();
emitter.on('user:login', ({ userId }) => console.log('Logged in:', userId));
emitter.emit('user:login', { userId: 'abc', timestamp: new Date() });`,
      },
    }),
  ]);

  await Promise.all(
    tsItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: tsCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: tsCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: Next.js Patterns
  // ============================================
  console.log("Seeding Next.js Patterns collection...");
  const nextCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-nextjs" },
    update: {},
    create: {
      id: "seed-collection-nextjs",
      name: "Next.js Patterns",
      description: "App Router patterns, server actions, and data fetching",
      userId: user.id,
      defaultTypeId: typeMap.snippet.id,
    },
  });

  const nextItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-next-1" },
      update: {},
      create: {
        id: "seed-item-next-1",
        title: "Server Action with Zod",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export async function createItem(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  const parsed = createItemSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    tags: formData.getAll('tags'),
  });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const item = await db.item.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath('/dashboard');
  return { data: item };
}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-next-2" },
      update: {},
      create: {
        id: "seed-item-next-2",
        title: "Dynamic Metadata",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `import { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: { template: '%s | DevStash', default: 'DevStash' },
  description: 'A unified hub for developer knowledge & resources.',
  openGraph: { type: 'website', siteName: 'DevStash' },
};

// Dynamic metadata for item/collection pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getItem(params.id);
  if (!item) return { title: 'Not Found' };

  return {
    title: item.title,
    description: item.description ?? undefined,
    openGraph: {
      title: item.title,
      description: item.description ?? undefined,
    },
  };
}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-next-3" },
      update: {},
      create: {
        id: "seed-item-next-3",
        title: "Middleware Auth Guard",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
      },
    }),
  ]);

  await Promise.all(
    nextItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: nextCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: nextCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: Database & SQL
  // ============================================
  console.log("Seeding Database & SQL collection...");
  const dbCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-database" },
    update: {},
    create: {
      id: "seed-collection-database",
      name: "Database & SQL",
      description: "Prisma patterns, SQL queries, and migration workflows",
      userId: user.id,
      defaultTypeId: typeMap.snippet.id,
    },
  });

  const dbItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-db-1" },
      update: {},
      create: {
        id: "seed-item-db-1",
        title: "Prisma Relation Queries",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `// Eager load with include
const userWithItems = await prisma.user.findUnique({
  where: { id },
  include: {
    items: {
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { itemType: true, tags: true },
    },
    collections: { orderBy: { updatedAt: 'desc' } },
  },
});

// Select only needed fields (avoids over-fetching)
const items = await prisma.item.findMany({
  where: { userId, isFavorite: true },
  select: { id: true, title: true, description: true, updatedAt: true },
  orderBy: { updatedAt: 'desc' },
});

// Upsert — create or update in one query
await prisma.tag.upsert({
  where: { name: tagName },
  update: {},
  create: { name: tagName },
});`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-db-2" },
      update: {},
      create: {
        id: "seed-item-db-2",
        title: "Prisma Migration Workflow",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `# 1. Edit prisma/schema.prisma

# 2. Create a migration (applies to dev DB automatically)
npx prisma migrate dev --name add_is_pinned_to_items

# 3. Verify migration status before committing
npx prisma migrate status

# 4. Regenerate the Prisma client after schema changes
npx prisma generate

# 5. Apply pending migrations to production
npx prisma migrate deploy

# Useful extras
npx prisma studio          # GUI to browse/edit data
npx prisma db seed         # Run seed script
npx prisma migrate reset   # ⚠️  Drop DB and re-run all migrations (dev only)`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-db-3" },
      update: {},
      create: {
        id: "seed-item-db-3",
        title: "Cursor Pagination Pattern",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `// Cursor-based pagination — efficient for large datasets
async function getItemsPage(cursor?: string, take = 20) {
  return prisma.item.findMany({
    take,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true },
  });
}

// Offset pagination — simpler, good for small/moderate datasets
async function getItemsOffset(page: number, pageSize = 20) {
  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.item.count(),
  ]);
  return { items, total, totalPages: Math.ceil(total / pageSize) };
}`,
      },
    }),
  ]);

  await Promise.all(
    dbItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: dbCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: dbCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: Interview Prep
  // ============================================
  console.log("Seeding Interview Prep collection...");
  const interviewCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-interview" },
    update: {},
    create: {
      id: "seed-collection-interview",
      name: "Interview Prep",
      description: "Algorithms, system design notes, and mock question prompts",
      userId: user.id,
      defaultTypeId: typeMap.snippet.id,
    },
  });

  const interviewItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-interview-1" },
      update: {},
      create: {
        id: "seed-item-interview-1",
        title: "Binary Search",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `// O(log n) — sorted array required
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// Variant: find leftmost insertion point
function lowerBound(arr: number[], target: number): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-interview-2" },
      update: {},
      create: {
        id: "seed-item-interview-2",
        title: "System Design Cheatsheet",
        contentType: ContentType.TEXT,
        language: "markdown",
        userId: user.id,
        itemTypeId: typeMap.note.id,
        content: `# System Design Cheatsheet

## Numbers to know
- 1 million requests/day ≈ 12 req/sec
- Read/write ratio for most apps: 80/20
- SQL row read ~1ms | Redis get ~0.1ms | Network RTT ~100ms

## Standard components
| Need | Solution |
|------|----------|
| Cache reads | Redis / Memcached |
| Full-text search | Elasticsearch |
| Async processing | SQS / Kafka |
| CDN | CloudFront / Cloudflare |
| Rate limiting | Token bucket / sliding window |

## Scalability checklist
- [ ] Horizontal scaling for stateless services
- [ ] DB read replicas for read-heavy workloads
- [ ] Sharding for write-heavy workloads
- [ ] Connection pooling (PgBouncer)
- [ ] Caching layer for expensive queries
- [ ] Async jobs for non-critical paths`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-interview-3" },
      update: {},
      create: {
        id: "seed-item-interview-3",
        title: "Mock Interview Prompt",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.prompt.id,
        content: `You are a senior engineer conducting a technical interview. Ask me one LeetCode-style problem at medium difficulty.

After I provide a solution:
1. Point out any bugs or edge cases I missed
2. Analyse time and space complexity
3. Suggest a more optimal approach if one exists
4. Ask one follow-up question to go deeper

Keep feedback direct and concise — no padding.`,
      },
    }),
  ]);

  await Promise.all(
    interviewItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: interviewCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: interviewCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: Security Notes
  // ============================================
  console.log("Seeding Security Notes collection...");
  const securityCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-security" },
    update: {},
    create: {
      id: "seed-collection-security",
      name: "Security Notes",
      description: "Auth patterns, OWASP checklist, and security best practices",
      userId: user.id,
      defaultTypeId: typeMap.note.id,
    },
  });

  const securityItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-security-1" },
      update: {},
      create: {
        id: "seed-item-security-1",
        title: "OWASP Top 10 Checklist",
        contentType: ContentType.TEXT,
        language: "markdown",
        userId: user.id,
        itemTypeId: typeMap.note.id,
        content: `# OWASP Top 10 — Quick Reference

1. **Broken Access Control** — Verify auth on every route; never trust client-sent IDs alone
2. **Cryptographic Failures** — Use bcrypt/argon2 for passwords; TLS everywhere; no MD5/SHA-1
3. **Injection** — Use parameterised queries (Prisma handles this); validate all input with Zod
4. **Insecure Design** — Threat-model new features; apply least privilege at DB level
5. **Security Misconfiguration** — Disable debug in prod; review default credentials; set CSP headers
6. **Vulnerable Components** — Run \`npm audit\` in CI; pin dependency versions; use Dependabot
7. **Auth Failures** — Enforce MFA for admin routes; rate-limit login; rotate secrets
8. **Software Integrity Failures** — Verify CI/CD pipeline integrity; use signed commits
9. **Logging Failures** — Log auth events; never log passwords/tokens; centralise logs
10. **SSRF** — Allowlist outbound URLs; never forward raw user-supplied URLs to internal services`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-security-2" },
      update: {},
      create: {
        id: "seed-item-security-2",
        title: "JWT Best Practices",
        contentType: ContentType.TEXT,
        language: "typescript",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!; // min 256-bit random secret

export function signToken(payload: object, expiresIn = '15m') {
  return jwt.sign(payload, SECRET, { algorithm: 'HS256', expiresIn });
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, SECRET) as T; // throws on invalid/expired
}

// ❌ Common mistakes:
// - Storing sensitive data in payload (it's base64, not encrypted)
// - Long expiry — use short-lived access + refresh token pattern
// - Using 'none' algorithm — always specify { algorithms: ['HS256'] } when verifying
// - Trusting the 'alg' header from the token itself`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-security-3" },
      update: {},
      create: {
        id: "seed-item-security-3",
        title: "OWASP Cheat Sheet Series",
        contentType: ContentType.URL,
        url: "https://cheatsheetseries.owasp.org/",
        description: "Concise, actionable guidance on specific web security topics.",
        userId: user.id,
        itemTypeId: typeMap.link.id,
      },
    }),
  ]);

  await Promise.all(
    securityItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: securityCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: securityCollection.id },
      })
    )
  );

  // ============================================
  // COLLECTION: VS Code Setup
  // ============================================
  console.log("Seeding VS Code Setup collection...");
  const vscodeCollection = await prisma.collection.upsert({
    where: { id: "seed-collection-vscode" },
    update: {},
    create: {
      id: "seed-collection-vscode",
      name: "VS Code Setup",
      description: "Extensions, settings JSON, and keybindings",
      userId: user.id,
      defaultTypeId: typeMap.note.id,
    },
  });

  const vscodeItems = await Promise.all([
    prisma.item.upsert({
      where: { id: "seed-item-vscode-1" },
      update: {},
      create: {
        id: "seed-item-vscode-1",
        title: "Essential Extensions",
        contentType: ContentType.TEXT,
        language: "markdown",
        userId: user.id,
        itemTypeId: typeMap.note.id,
        content: `# Essential VS Code Extensions

## Code Quality
- **ESLint** \`dbaeumer.vscode-eslint\`
- **Prettier** \`esbenp.prettier-vscode\`
- **Error Lens** \`usernamehw.errorlens\`

## TypeScript / React
- **Tailwind CSS IntelliSense** \`bradlc.vscode-tailwindcss\`
- **ES7+ React/Redux snippets** \`dsznajder.es7-react-js-snippets\`

## Git
- **GitLens** \`eamodio.gitlens\`
- **Git Graph** \`mhutchie.git-graph\`

## Productivity
- **Path IntelliSense** \`christian-kohler.path-intellisense\`
- **Auto Rename Tag** \`formulahendry.auto-rename-tag\`
- **Thunder Client** \`rangav.vscode-thunder-client\``,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-vscode-2" },
      update: {},
      create: {
        id: "seed-item-vscode-2",
        title: "settings.json",
        contentType: ContentType.TEXT,
        language: "json",
        userId: user.id,
        itemTypeId: typeMap.snippet.id,
        content: `{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.tabSize": 2,
  "editor.fontSize": 14,
  "editor.fontFamily": "'Geist Mono', 'Fira Code', monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.minimap.enabled": false,
  "editor.stickyScroll.enabled": true,
  "terminal.integrated.fontSize": 13,
  "workbench.colorTheme": "One Dark Pro",
  "typescript.updateImportsOnFileMove.enabled": "always"
}`,
      },
    }),
    prisma.item.upsert({
      where: { id: "seed-item-vscode-3" },
      update: {},
      create: {
        id: "seed-item-vscode-3",
        title: "Install Extensions via CLI",
        contentType: ContentType.TEXT,
        userId: user.id,
        itemTypeId: typeMap.command.id,
        content: `code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension usernamehw.errorlens
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension eamodio.gitlens
code --install-extension mhutchie.git-graph
code --install-extension christian-kohler.path-intellisense
code --install-extension rangav.vscode-thunder-client

# List currently installed extensions
code --list-extensions`,
      },
    }),
  ]);

  await Promise.all(
    vscodeItems.map((item) =>
      prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: vscodeCollection.id } },
        update: {},
        create: { itemId: item.id, collectionId: vscodeCollection.id },
      })
    )
  );

  const totalItems =
    reactItems.length +
    aiItems.length +
    devopsItems.length +
    terminalItems.length +
    designItems.length +
    tsItems.length +
    nextItems.length +
    dbItems.length +
    interviewItems.length +
    securityItems.length +
    vscodeItems.length;

  console.log("Seeding complete!");
  console.log(`  User:        demo@devstash.io`);
  console.log(`  Item types:  ${systemItemTypes.length}`);
  console.log(`  Collections: 11`);
  console.log(`  Items:       ${totalItems}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
