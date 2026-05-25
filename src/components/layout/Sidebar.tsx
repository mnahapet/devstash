'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,

  Image,
  Link as LinkIcon,
  ChevronDown,
  Star,
  Heart,
  Pin,
  Clock,
  FolderOpen,
  Library,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSidebar } from './sidebar-context';
import type { ItemTypeWithCount } from '@/lib/db/item-types';
import type {
  SidebarUser,
  SidebarFavCollection,
  SidebarFavItem,
  SidebarRecentCollection,
  SidebarRecentItem,
  SidebarPinnedCollection,
  SidebarPinnedItem,
} from '@/types/sidebar';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function getDominantTypeColor(
  distribution: { color: string; count: number }[]
): string {
  if (!distribution.length) return 'currentColor';
  return distribution.reduce((max, d) => d.count > max.count ? d : max).color;
}

function getUserInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}


interface SidebarProps {
  user: SidebarUser;
  itemTypes: ItemTypeWithCount[];
  pinnedCollections: SidebarPinnedCollection[];
  pinnedItems: SidebarPinnedItem[];
  favoriteCollections: SidebarFavCollection[];
  favoriteItems: SidebarFavItem[];
  recentCollections: SidebarRecentCollection[];
  recentItems: SidebarRecentItem[];
}

function MiniSidebarContent({
  itemTypes,
  pinnedCollections,
  favoriteCollections,
  recentCollections,
  favoriteItems,
  recentItems,
  user,
  onClose,
  onToggle,
  showToggle = true,
}: {
  itemTypes: ItemTypeWithCount[];
  pinnedCollections: SidebarPinnedCollection[];
  favoriteCollections: SidebarFavCollection[];
  recentCollections: SidebarRecentCollection[];
  favoriteItems: SidebarFavItem[];
  recentItems: SidebarRecentItem[];
  user: SidebarUser;
  onClose?: () => void;
  onToggle?: () => void;
  showToggle?: boolean;
}) {
  const initials = getUserInitials(user.name);

  return (
    <div className='flex flex-col items-center h-full py-2'>
      <div className='sidebar-scroll flex-1 overflow-y-auto flex flex-col items-center w-full px-1.5'>
        {/* Toggle */}
        {showToggle && (
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 hover:bg-accent dark:hover:bg-white/10 hover:text-foreground transition-colors shrink-0'
            onClick={onToggle}
            aria-label='Toggle sidebar'
          >
            <PanelLeftOpen className='h-4 w-4' />
          </Button>
        )}

        {/* Pinned collection */}
        {pinnedCollections[0] && (
          <Link
            href={`/collections/${pinnedCollections[0].id}`}
            title={pinnedCollections[0].name}
            onClick={onClose}
            className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
          >
            <Pin className='h-4 w-4 shrink-0 fill-foreground text-foreground' />
          </Link>
        )}

        <div className='w-full border-t border-muted-foreground/30 my-1.5 shrink-0' />

        {/* Type icons */}
        <div className='flex flex-col items-center gap-0.5 w-full'>
          {itemTypes.map(type => {
            const Icon = ICON_MAP[type.icon];
            return (
              <Link
                key={type.id}
                href={`/items/${type.name}`}
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

        <div className='w-full border-t border-muted-foreground/30 my-1.5 shrink-0' />

        {/* Collections group */}
        <Link
          href='/collections'
          title='All Collections'
          onClick={onClose}
          className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
        >
          <FolderOpen className='h-4 w-4 shrink-0' />
        </Link>
        {favoriteCollections[0] && (
          <Link
            href={`/collections/${favoriteCollections[0].id}`}
            title={favoriteCollections[0].name}
            onClick={onClose}
            className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
          >
            <Heart className='h-4 w-4 shrink-0 fill-pink-500 text-pink-500' />
          </Link>
        )}
        {recentCollections[0] && (
          <Link
            href={`/collections/${recentCollections[0].id}`}
            title={recentCollections[0].name}
            onClick={onClose}
            className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
          >
            <div
              className='h-3 w-3 rounded-full shrink-0'
              style={{ backgroundColor: getDominantTypeColor(recentCollections[0].typeDistribution) }}
            />
          </Link>
        )}

        <div className='w-full border-t border-muted-foreground/30 my-1.5 shrink-0' />

        {/* Items group */}
        <Link
          href='/items'
          title='All Items'
          onClick={onClose}
          className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
        >
          <Library className='h-4 w-4 shrink-0' />
        </Link>
        {favoriteItems[0] && (
          <Link
            href={`/items/${favoriteItems[0].id}`}
            title={favoriteItems[0].title}
            onClick={onClose}
            className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
          >
            <Star className='h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400' />
          </Link>
        )}
        {recentItems[0] && (
          <Link
            href={`/items/${recentItems[0].id}`}
            title={recentItems[0].title}
            onClick={onClose}
            className='flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors shrink-0'
          >
            <div
              className='h-3 w-3 rounded-full shrink-0'
              style={{ backgroundColor: recentItems[0].itemType.color }}
            />
          </Link>
        )}
      </div>

      <div className='shrink-0 pt-2 border-t border-border w-full flex justify-center'>
        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-semibold'>
          {initials}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  user,
  itemTypes,
  pinnedCollections,
  pinnedItems,
  favoriteCollections,
  favoriteItems,
  recentCollections,
  recentItems,
  onClose,
}: SidebarProps & { onClose?: () => void }) {
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [itemsOpen, setItemsOpen] = useState(true);
  const { toggleCollapsed } = useSidebar();

  const initials = getUserInitials(user.name);
  const handleToggle = onClose ?? toggleCollapsed;

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Sidebar header */}
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
              {pinnedCollections.map(col => (
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
              {pinnedItems.map(item => (
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
              {itemTypes.map(type => {
                const Icon = ICON_MAP[type.icon];
                return (
                  <Link
                    key={type.id}
                    href={`/items/${type.name}`}
                    onClick={onClose}
                    className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                  >
                    {Icon && (
                      <Icon className='h-4 w-4 shrink-0' style={{ color: type.color }} />
                    )}
                    <span className='flex-1 capitalize'>{type.name}s</span>
                    {(type.name === 'file' || type.name === 'image') && (
                      <Badge
                        variant='outline'
                        className='text-[10px] px-1.5 py-0 h-4 font-semibold tracking-wide border-0 rounded-sm'
                        style={{ background: 'linear-gradient(135deg, oklch(0.6 0.16 80), oklch(0.55 0.18 50))', color: '#fff', borderRadius: '3px' }}
                      >
                        PRO
                      </Badge>
                    )}
                    <span className='text-xs text-muted-foreground'>{type.count}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Collections */}
        <div className='mt-4 pt-2 border-t border-border'>
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
            <div className='mt-1'>
              {/* Favorites subgroup */}
              {favoriteCollections.length > 0 && (
                <>
                  <p className='px-2 py-1 text-xs text-muted-foreground'>Favorites</p>
                  <div className='space-y-0.5 mb-2'>
                    {favoriteCollections.map(col => (
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
                  </div>
                </>
              )}

              {/* Recent subgroup */}
              {recentCollections.length > 0 && (
                <>
                  <p className='px-2 py-1 text-xs text-muted-foreground'>Recent</p>
                  <div className='space-y-0.5'>
                    {recentCollections.map(col => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        onClick={onClose}
                        className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                      >
                        <div
                          className='h-2.5 w-2.5 rounded-full shrink-0'
                          style={{ backgroundColor: getDominantTypeColor(col.typeDistribution) }}
                        />
                        <span className='flex-1 truncate'>{col.name}</span>
                        <span className='text-xs text-muted-foreground'>{col.itemCount}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* View all */}
              <Link
                href='/collections'
                onClick={onClose}
                className='flex items-center px-2 py-1.5 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
              >
                View all
              </Link>
            </div>
          )}
        </div>

        {/* Items */}
        <div className='mt-4 pt-2 border-t border-border'>
          <button
            onClick={() => setItemsOpen(prev => !prev)}
            className='flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors'
          >
            Items
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                !itemsOpen && '-rotate-90'
              )}
            />
          </button>

          {itemsOpen && (
            <div className='mt-1'>
              {favoriteItems.length > 0 && (
                <>
                  <p className='px-2 py-1 text-xs text-muted-foreground'>Favorites</p>
                  <div className='space-y-0.5 mb-2'>
                    {favoriteItems.map(item => (
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
                </>
              )}

              {recentItems.length > 0 && (
                <>
                  <p className='px-2 py-1 text-xs text-muted-foreground'>Recent</p>
                  <div className='space-y-0.5'>
                    {recentItems.map(item => (
                      <Link
                        key={item.id}
                        href={`/items/${item.id}`}
                        onClick={onClose}
                        className='flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors'
                      >
                        <div
                          className='h-2.5 w-2.5 rounded-full shrink-0'
                          style={{ backgroundColor: item.itemType.color }}
                        />
                        <span className='flex-1 truncate'>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <Link
                href='/items'
                onClick={onClose}
                className='flex items-center px-2 py-1.5 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
              >
                View all
              </Link>
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
            <p className='text-sm font-medium truncate'>{user.name ?? 'User'}</p>
            <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
          </div>
          <Button variant='ghost' size='icon' className='h-7 w-7 shrink-0'>
            <Settings className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  const { isCollapsed, isMobileOpen, closeMobile, toggleCollapsed, toggleMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border shrink-0 transition-[width] duration-200 overflow-hidden bg-card',
          isCollapsed ? 'w-12' : 'w-60'
        )}
      >
        {isCollapsed
          ? <MiniSidebarContent itemTypes={props.itemTypes} pinnedCollections={props.pinnedCollections} favoriteCollections={props.favoriteCollections} recentCollections={props.recentCollections} favoriteItems={props.favoriteItems} recentItems={props.recentItems} user={props.user} onToggle={toggleCollapsed} />
          : <SidebarContent {...props} />}
      </aside>

      {/* Mobile mini sidebar */}
      <aside className='lg:hidden flex flex-col items-center shrink-0 w-12 border-r border-border bg-card'>
        <MiniSidebarContent itemTypes={props.itemTypes} pinnedCollections={props.pinnedCollections} favoriteCollections={props.favoriteCollections} recentCollections={props.recentCollections} favoriteItems={props.favoriteItems} recentItems={props.recentItems} user={props.user} onToggle={toggleMobile} showToggle={!isMobileOpen} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
        <SheetContent
          side='left'
          className='p-0 gap-0 bg-card'
          showCloseButton={false}
          overlayClassName='top-14'
          style={{ top: '3.5rem', height: 'calc(100dvh - 3.5rem)', width: '15rem' }}
        >
          <SheetTitle className='sr-only'>Navigation</SheetTitle>
          <SidebarContent {...props} onClose={closeMobile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
