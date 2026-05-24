import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
  Pin,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { mockItemTypes } from '@/lib/mock-data';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

interface Item {
  id: string;
  title: string;
  description?: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  tags: string[];
  createdAt: Date;
}

export default function ItemCard({ item }: { item: Item }) {
  const itemType = mockItemTypes.find(t => t.id === item.itemTypeId);
  const Icon = itemType ? ICON_MAP[itemType.icon] : null;

  const date = item.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className='flex flex-col rounded-lg border border-border bg-card p-3 hover:bg-accent/30 transition-colors cursor-pointer h-full'
      style={itemType?.color ? { borderLeftWidth: '2px', borderLeftColor: itemType.color } : undefined}
    >
      <div className='flex items-start justify-between gap-2'>
        <div
          className='flex items-center justify-center h-5 w-5 rounded shrink-0'
          style={{ backgroundColor: itemType ? `${itemType.color}20` : undefined }}
        >
          {Icon && (
            <Icon className='h-3 w-3' style={{ color: itemType?.color }} />
          )}
        </div>
        <div className='flex items-center gap-1'>
          {item.isFavorite && <Heart className='h-3 w-3 fill-pink-500 text-pink-500' />}
          {item.isFavorite && <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />}
          {item.isPinned && <Pin className='h-3 w-3 fill-white text-white' />}
        </div>
      </div>

      <p className='mt-2 font-medium text-sm leading-snug line-clamp-2'>
        {item.title}
      </p>

      {item.description && (
        <p className='mt-2 text-xs text-muted-foreground line-clamp-2'>
          {item.description}
        </p>
      )}

      <div className='mt-auto pt-3 flex items-end justify-between gap-2'>
        {item.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {item.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className='px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className='text-[10px] text-muted-foreground shrink-0 ml-auto'>
          {date}
        </span>
      </div>
    </div>
  );
}
