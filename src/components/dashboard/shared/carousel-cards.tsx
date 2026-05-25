import {
  Heart, Star, Pin, FolderOpen,
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, type LucideIcon,
} from 'lucide-react';
import type { CollectionWithStats } from '@/lib/db/collections';
import type { ItemWithType } from '@/lib/db/items';

export const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
};

export function getDominantTypeColor(distribution: CollectionWithStats['typeDistribution']): string {
  if (!distribution.length) return 'currentColor';
  return distribution.reduce((max, d) => d.count > max.count ? d : max).color;
}

export function buildGradient(distribution: CollectionWithStats['typeDistribution']): string {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return 'transparent';
  let cumulative = 0;
  const stops: string[] = [];
  for (const { color, count } of distribution) {
    const start = (cumulative / total) * 100;
    cumulative += count;
    const end = (cumulative / total) * 100;
    stops.push(`${color} ${start}%`, `${color} ${end}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(', ')})`;
}

interface CollectionCarouselCardProps {
  col: CollectionWithStats;
  showHeart?: boolean;
  showPin?: boolean;
}

export function CollectionCarouselCard({ col, showHeart = true, showPin = true }: CollectionCarouselCardProps) {
  const gradient = buildGradient(col.typeDistribution);

  return (
    <div className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer h-full'>
      <div className='w-0.5 shrink-0' style={{ background: gradient }} />
      <div className='flex flex-col flex-1 p-4 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-1.5'>
            <FolderOpen className='h-4 w-4 shrink-0' style={{ color: getDominantTypeColor(col.typeDistribution) }} />
            <span className='text-xs text-muted-foreground'>{col.itemCount} items</span>
          </div>
          <div className='flex items-center gap-1 shrink-0'>
            {showHeart && col.isFavorite && <Heart className='h-3.5 w-3.5 fill-pink-500 text-pink-500' />}
            {col.hasFavoriteItem && <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />}
            {showPin && col.isPinned && <Pin className='h-3.5 w-3.5 fill-foreground text-foreground' />}
          </div>
        </div>
        <p className='mt-2 font-semibold text-sm line-clamp-2'>{col.name}</p>
        {col.description && (
          <p className='mt-2 text-xs text-muted-foreground line-clamp-2'>{col.description}</p>
        )}
        {col.typeDistribution.length > 0 && (
          <div className='flex items-center gap-2 mt-auto pt-3'>
            {col.typeDistribution.map(type => {
              const Icon = ICON_MAP[type.icon];
              return Icon ? <Icon key={type.typeId} className='h-3.5 w-3.5' style={{ color: type.color }} /> : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface ItemCarouselCardProps {
  item: ItemWithType;
  showHeart?: boolean;
  showPin?: boolean;
}

export function ItemCarouselCard({ item, showHeart = true, showPin = true }: ItemCarouselCardProps) {
  const Icon = ICON_MAP[item.itemType.icon] ?? null;
  const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <div
      className='flex flex-col rounded-lg border border-border bg-card p-3 hover:bg-accent/30 transition-colors cursor-pointer h-full'
      style={{ borderLeftWidth: '2px', borderLeftColor: item.itemType.color }}
    >
      <div className='flex items-start justify-between gap-2'>
        <div
          className='flex items-center justify-center h-5 w-5 rounded shrink-0'
          style={{ backgroundColor: `${item.itemType.color}20` }}
        >
          {Icon && <Icon className='h-3 w-3' style={{ color: item.itemType.color }} />}
        </div>
        <div className='flex items-center gap-1 shrink-0'>
          {showHeart && item.inFavoriteCollection && <Heart className='h-3 w-3 fill-pink-500 text-pink-500' />}
          {item.isFavorite && <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />}
          {showPin && item.isPinned && <Pin className='h-3 w-3 fill-foreground text-foreground' />}
        </div>
      </div>
      <p className='mt-2 font-medium text-sm leading-snug line-clamp-2'>{item.title}</p>
      {item.description && (
        <p className='mt-2 text-xs text-muted-foreground line-clamp-2'>{item.description}</p>
      )}
      <div className='mt-auto pt-3 flex items-end justify-between gap-2'>
        {item.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag.id} className='px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'>
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <span className='text-[10px] text-muted-foreground shrink-0 ml-auto'>{date}</span>
      </div>
    </div>
  );
}
