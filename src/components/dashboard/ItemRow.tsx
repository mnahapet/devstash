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

export default function ItemRow({ item, showTypeBorder = false }: { item: Item; showTypeBorder?: boolean }) {
  const itemType = mockItemTypes.find(t => t.id === item.itemTypeId);
  const Icon = itemType ? ICON_MAP[itemType.icon] : null;

  const date = item.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className='flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer'
      style={showTypeBorder && itemType?.color ? { borderLeftWidth: '2px', borderLeftColor: itemType.color } : undefined}
    >
      <div
        className='flex items-center justify-center h-8 w-8 rounded-md shrink-0 mt-0.5'
        style={{ backgroundColor: itemType ? `${itemType.color}20` : undefined }}
      >
        {Icon && (
          <Icon className='h-4 w-4' style={{ color: itemType?.color }} />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-1.5'>
          <span className='font-medium text-sm truncate'>{item.title}</span>
          {item.isFavorite && <Heart className='h-3 w-3 shrink-0 fill-pink-500 text-pink-500' />}
          {item.isFavorite && <Star className='h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400' />}
          {item.isPinned && <Pin className='h-3 w-3 shrink-0 fill-white text-white' />}
        </div>
        {item.description && (
          <p className='text-xs text-muted-foreground mt-2 truncate'>
            {item.description}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-3'>
            {item.tags.map(tag => (
              <span
                key={tag}
                className='px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className='text-xs text-muted-foreground shrink-0'>{date}</span>
    </div>
  );
}
