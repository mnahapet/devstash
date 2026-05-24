'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Folder,
  Image,
  Link as LinkIcon,
  ChevronDown,
  Star,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSidebar } from './sidebar-context';
import {
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
  mockUser,
} from '@/lib/mock-data';

function getDominantTypeColor(
  distribution: { typeId: string; count: number }[]
): string {
  if (!distribution.length) return 'currentColor';
  const dominant = distribution.reduce((max, d) =>
    d.count > max.count ? d : max
  );
  return mockItemTypes.find(t => t.id === dominant.typeId)?.color ?? 'currentColor';
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function getUserInitials() {
  return mockUser.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function MiniSidebarContent({ onClose }: { onClose?: () => void }) {
  const initials = getUserInitials();

  return (
    <div className='flex flex-col items-center h-full py-2'>
      <div className='sidebar-scroll flex-1 overflow-y-auto flex flex-col items-center gap-0.5 w-full px-1.5'>
        {mockItemTypes.map(type => {
          const Icon = ICON_MAP[type.icon];
          return (
            <Link
              key={type.id}
              href={`/items/${type.name}s`}
              title={`${type.name}s`}
              onClick={onClose}
              className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors'
            >
              {Icon && (
                <Icon className='h-4 w-4 shrink-0' style={{ color: type.color }} />
              )}
            </Link>
          );
        })}
      </div>

      <div className='shrink-0 pt-2 border-t border-border w-full flex justify-center'>
        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-semibold'>
          {initials}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const favoriteCollections = mockCollections.filter(c => c.isFavorite);
  const otherCollections = mockCollections.filter(c => !c.isFavorite);

  const initials = getUserInitials();

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='sidebar-scroll flex-1 overflow-y-auto py-3 px-2'>
        {/* Types */}
        <div>
          <button
            onClick={() => setTypesOpen(prev => !prev)}
            className='flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors'
          >
            Types
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                !typesOpen && '-rotate-90'
              )}
            />
          </button>

          {typesOpen && (
            <div className='mt-1 space-y-0.5'>
              {mockItemTypes.map(type => {
                const Icon = ICON_MAP[type.icon];
                const count =
                  mockItemTypeCounts[
                    type.name as keyof typeof mockItemTypeCounts
                  ] ?? 0;
                return (
                  <Link
                    key={type.id}
                    href={`/items/${type.name}s`}
                    onClick={onClose}
                    className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                  >
                    {Icon && (
                      <Icon
                        className='h-4 w-4 shrink-0'
                        style={{ color: type.color }}
                      />
                    )}
                    <span className='flex-1 capitalize'>{type.name}s</span>
                    <span className='text-xs text-muted-foreground'>{count}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Collections */}
        <div className='mt-4'>
          <button
            onClick={() => setCollectionsOpen(prev => !prev)}
            className='flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors'
          >
            Collections
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                !collectionsOpen && '-rotate-90'
              )}
            />
          </button>

          {collectionsOpen && (
            <div className='mt-1 space-y-0.5'>
              {favoriteCollections.length > 0 && (
                <>
                  <p className='px-2 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest'>
                    Favorites
                  </p>
                  {favoriteCollections.map(col => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      onClick={onClose}
                      className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                    >
                      <Star className='h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400' />
                      <span className='flex-1 truncate'>{col.name}</span>
                    </Link>
                  ))}
                </>
              )}

              {otherCollections.length > 0 && (
                <>
                  <p className='px-2 pt-3 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest'>
                    All Collections
                  </p>
                  {otherCollections.map(col => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      onClick={onClose}
                      className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                    >
                      <Folder
                        className='h-3.5 w-3.5 shrink-0'
                        style={{ color: getDominantTypeColor(col.typeDistribution) }}
                      />
                      <span className='flex-1 truncate'>{col.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        {col.itemCount}
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Area */}
      <div className='shrink-0 border-t border-border p-3'>
        <div className='flex items-center gap-2.5'>
          <div className='flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-semibold shrink-0'>
            {initials}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>{mockUser.name}</p>
            <p className='text-xs text-muted-foreground truncate'>
              {mockUser.email}
            </p>
          </div>
          <Button variant='ghost' size='icon' className='h-7 w-7 shrink-0'>
            <Settings className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar — full when expanded, mini (icons only) when collapsed */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border shrink-0 transition-[width] duration-200 overflow-hidden',
          isCollapsed ? 'w-12' : 'w-60'
        )}
      >
        {isCollapsed ? <MiniSidebarContent /> : <SidebarContent />}
      </aside>

      {/* Mobile mini sidebar — always visible on < lg */}
      <aside className='lg:hidden flex flex-col items-center shrink-0 w-12 border-r border-border bg-sidebar'>
        <MiniSidebarContent />
      </aside>

      {/* Mobile drawer — slides in from hamburger, starts below TopBar */}
      <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
        <SheetContent
          side='left'
          className='p-0 gap-0'
          overlayClassName='top-14'
          style={{ top: '3.5rem', height: 'calc(100dvh - 3.5rem)', width: '15rem' }}
        >
          <SheetTitle className='sr-only'>Navigation</SheetTitle>
          <SidebarContent onClose={closeMobile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
