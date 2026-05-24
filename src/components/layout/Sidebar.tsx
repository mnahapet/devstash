'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  FolderOpen,
  Image,
  Link as LinkIcon,
  ChevronDown,
  Star,
  Heart,
  Pin,
  Clock,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
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
  mockItems,
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

function MiniSidebarContent({ onClose, onToggle, showToggle = true }: { onClose?: () => void; onToggle?: () => void; showToggle?: boolean }) {
  const initials = getUserInitials();

  return (
    <div className='flex flex-col items-center h-full py-2'>
      {showToggle && (
        <div className='flex justify-end w-full mb-3 pr-1 shrink-0'>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'
            onClick={onToggle}
            aria-label='Toggle sidebar'
          >
            <PanelLeftOpen className='h-4 w-4' />
          </Button>
        </div>
      )}
      <div className='sidebar-scroll flex-1 overflow-y-auto flex flex-col items-center w-full px-1.5'>
        {/* Pin */}
        <Link
          href='/dashboard'
          title='Pinned'
          onClick={onClose}
          className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
        >
          <Pin className='h-4 w-4 shrink-0 fill-white text-white' />
        </Link>

        <div className='w-full border-t border-border my-1 shrink-0' />

        {/* Type icons */}
        <div className='flex flex-col items-center gap-0.5 w-full'>
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

        <div className='w-full border-t border-border my-1 shrink-0' />

        {/* Heart + Star */}
        <Link
          href='/dashboard'
          title='Favorites'
          onClick={onClose}
          className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
        >
          <Heart className='h-4 w-4 shrink-0 fill-pink-500 text-pink-500' />
        </Link>
        <Link
          href='/dashboard'
          title='Favorites'
          onClick={onClose}
          className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
        >
          <Star className='h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400' />
        </Link>

        <div className='w-full border-t border-border my-1 shrink-0' />

        {/* Recent */}
        <Link
          href='/dashboard'
          title='Recent'
          onClick={onClose}
          className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
        >
          <Clock className='h-4 w-4 shrink-0 text-muted-foreground' />
        </Link>
      </div>

      <div className='shrink-0 pt-2 border-t border-border w-full flex justify-center'>
        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-semibold'>
          {initials}
        </div>
      </div>
    </div>
  );
}

type SidebarFavCollection = { id: string; name: string; itemCount: number };

function SidebarContent({ onClose, favoriteCollections }: { onClose?: () => void; favoriteCollections?: SidebarFavCollection[] }) {
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);
  const { toggleCollapsed } = useSidebar();

  const pinnedCollection = [...mockCollections]
    .filter(c => c.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 1);

  const pinnedItem = [...mockItems]
    .filter(i => i.isPinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 1);

  const recentFavCollections = favoriteCollections ?? [];

  const recentFavItems = [...mockItems]
    .filter(i => i.isFavorite)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  const recentCollections = [...mockCollections]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  const recentItems = [...mockItems]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  const initials = getUserInitials();
  const handleToggle = onClose ?? toggleCollapsed;

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Sidebar header: Navigation label + collapse/close toggle */}
      <div className='flex items-center justify-between px-3 h-11 border-b border-border shrink-0'>
        <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Navigation</span>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors'
          onClick={handleToggle}
          aria-label='Toggle sidebar'
        >
          <PanelLeftClose className='h-4 w-4' />
        </Button>
      </div>
      <div className='sidebar-scroll flex-1 overflow-y-auto py-3 px-2'>
        {/* Pinned */}
        <div className='mb-4 pb-4 border-b border-border'>
          <button
            onClick={() => setPinnedOpen(prev => !prev)}
            className='flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors'
          >
            Pinned
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                !pinnedOpen && '-rotate-90'
              )}
            />
          </button>

          {pinnedOpen && (
            <div className='mt-1 space-y-0.5'>
              {pinnedCollection.map(col => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  onClick={onClose}
                  className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                >
                  <Pin className='h-3.5 w-3.5 shrink-0 fill-white text-white' />
                  <span className='flex-1 truncate'>{col.name}</span>
                  <span className='text-xs text-muted-foreground'>{col.itemCount}</span>
                </Link>
              ))}
              {pinnedItem.map(item => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  onClick={onClose}
                  className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                >
                  <Pin className='h-3.5 w-3.5 shrink-0 fill-white text-white' />
                  <span className='flex-1 truncate'>{item.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

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

        {/* Favorites */}
        <div className='mt-4 pt-2 border-t border-border'>
          <button
            onClick={() => setFavoritesOpen(prev => !prev)}
            className='flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors'
          >
            Favorites
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                !favoritesOpen && '-rotate-90'
              )}
            />
          </button>

          {favoritesOpen && (
            <div className='mt-1 space-y-0.5'>
              {recentFavCollections.map(col => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  onClick={onClose}
                  className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                >
                  <Heart className='h-3.5 w-3.5 shrink-0 fill-pink-500 text-pink-500' />
                  <span className='flex-1 truncate'>{col.name}</span>
                  <span className='text-xs text-muted-foreground'>{col.itemCount}</span>
                </Link>
              ))}
              {recentFavItems.map(item => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  onClick={onClose}
                  className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                >
                  <Star className='h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400' />
                  <span className='flex-1 truncate'>{item.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent */}
        <div className='mt-4 pt-2 border-t border-border'>
          <button
            onClick={() => setRecentOpen(prev => !prev)}
            className='flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors'
          >
            Recent
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                !recentOpen && '-rotate-90'
              )}
            />
          </button>

          {recentOpen && (
            <div className='mt-1 space-y-0.5'>
              {recentCollections.map(col => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  onClick={onClose}
                  className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                >
                  <FolderOpen
                    className='h-3.5 w-3.5 shrink-0'
                    style={{ color: getDominantTypeColor(col.typeDistribution) }}
                  />
                  <span className='flex-1 truncate'>{col.name}</span>
                  <span className='text-xs text-muted-foreground'>{col.itemCount}</span>
                </Link>
              ))}
              {recentItems.map(item => {
                const type = mockItemTypes.find(t => t.id === item.itemTypeId);
                const Icon = type ? ICON_MAP[type.icon] : null;
                return (
                  <Link
                    key={item.id}
                    href={`/items/${item.id}`}
                    onClick={onClose}
                    className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                  >
                    {Icon && (
                      <Icon className='h-3.5 w-3.5 shrink-0' style={{ color: type!.color }} />
                    )}
                    <span className='flex-1 truncate'>{item.title}</span>
                  </Link>
                );
              })}
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

export default function Sidebar({ favoriteCollections }: { favoriteCollections?: SidebarFavCollection[] }) {
  const { isCollapsed, isMobileOpen, closeMobile, toggleCollapsed, toggleMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar — full when expanded, mini (icons only) when collapsed */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border shrink-0 transition-[width] duration-200 overflow-hidden',
          isCollapsed ? 'w-12' : 'w-60'
        )}
      >
        {isCollapsed ? <MiniSidebarContent onToggle={toggleCollapsed} /> : <SidebarContent favoriteCollections={favoriteCollections} />}
      </aside>

      {/* Mobile mini sidebar — always visible on < lg */}
      <aside className='lg:hidden flex flex-col items-center shrink-0 w-12 border-r border-border bg-sidebar'>
        <MiniSidebarContent onToggle={toggleMobile} showToggle={!isMobileOpen} />
      </aside>

      {/* Mobile drawer — slides in beside mini sidebar, starts below TopBar */}
      <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
        <SheetContent
          side='left'
          className='p-0 gap-0'
          showCloseButton={false}
          overlayClassName='top-14'
          style={{ top: '3.5rem', height: 'calc(100dvh - 3.5rem)', width: '15rem' }}
        >
          <SheetTitle className='sr-only'>Navigation</SheetTitle>
          <SidebarContent onClose={closeMobile} favoriteCollections={favoriteCollections} />
        </SheetContent>
      </Sheet>
    </>
  );
}
