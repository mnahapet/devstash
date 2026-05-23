'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Layers,
  PanelLeft,
  Plus,
  Search,
  Sun,
  Moon,
  LayoutGrid,
  List,
  FolderPlus,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { useTheme } from './theme-context';
import { useView } from '@/components/dashboard/view-context';
import { cn } from '@/lib/utils';

export default function TopBar() {
  const { toggleCollapsed, toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { viewMode, setViewMode } = useView();

  return (
    <header className='flex items-center gap-2 px-4 h-14 border-b border-border shrink-0'>
      {/* Left: logo + sidebar toggle */}
      <div className='flex items-center gap-2 shrink-0'>
        <div className='flex items-center justify-center h-7 w-7 rounded-sm bg-linear-to-br from-violet-500 to-indigo-700'>
          <Layers className='h-4 w-4 text-white' />
        </div>
        <span className='text-lg font-semibold tracking-tight hidden sm:block'>
          DevStash
        </span>
        <Button
          variant='ghost'
          size='icon'
          className='hidden lg:flex h-7 w-7 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'
          onClick={toggleCollapsed}
          aria-label='Toggle sidebar'
        >
          <PanelLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden h-7 w-7 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'
          onClick={toggleMobile}
          aria-label='Open sidebar'
        >
          <PanelLeft className='h-4 w-4' />
        </Button>
      </div>

      {/* Center: search — hidden on mobile */}
      <div className='relative flex-1 max-w-sm mx-auto hidden sm:block'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search items...'
          className='pl-9 pr-16 bg-muted border-0 w-full'
        />
        <kbd className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground'>
          ⌘K
        </kbd>
      </div>

      {/* Right: controls */}
      <div className='flex items-center gap-1.5 ml-auto shrink-0'>
        {/* Mobile search icon */}
        <Button variant='ghost' size='icon' className='sm:hidden h-8 w-8 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'>
          <Search className='h-4 w-4' />
        </Button>

        {/* List/grid view switcher */}
        <div className='flex items-center rounded-md border border-border overflow-hidden'>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex items-center justify-center h-8 w-8 cursor-pointer transition-colors',
              viewMode === 'grid'
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent dark:hover:bg-white/10 hover:text-foreground'
            )}
            aria-label='Grid view'
          >
            <LayoutGrid className='h-3.5 w-3.5' />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center justify-center h-8 w-8 cursor-pointer transition-colors',
              viewMode === 'list'
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent dark:hover:bg-white/10 hover:text-foreground'
            )}
            aria-label='List view'
          >
            <List className='h-3.5 w-3.5' />
          </button>
        </div>

        {/* New Collection — hidden on mobile */}
        <Button variant='outline' size='sm' className='hidden md:flex hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'>
          <FolderPlus className='h-4 w-4' />
          New Collection
        </Button>

        {/* New Item */}
        <Button size='sm' className='hover:opacity-90 transition-opacity'>
          <Plus className='h-4 w-4' />
          <span className='hidden sm:inline'>New Item</span>
        </Button>

        {/* Dark/light toggle — right edge, extra left margin for separation */}
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 ml-2 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'
          onClick={toggleTheme}
          aria-label='Toggle theme'
        >
          {theme === 'dark' ? (
            <Sun className='h-4 w-4' />
          ) : (
            <Moon className='h-4 w-4' />
          )}
        </Button>
      </div>
    </header>
  );
}
