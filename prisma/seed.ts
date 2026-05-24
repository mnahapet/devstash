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

  console.log("Seeding complete!");
  console.log(`  User:        demo@devstash.io`);
  console.log(`  Item types:  ${systemItemTypes.length}`);
  console.log(`  Collections: 5 (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources)`);
  console.log(`  Items:       ${reactItems.length + aiItems.length + devopsItems.length + terminalItems.length + designItems.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
