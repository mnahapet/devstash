import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

export function getDominantTypeColor(distribution: { color: string; count: number }[]): string {
  if (!distribution.length) return 'currentColor';
  return distribution.reduce((max, d) => (d.count > max.count ? d : max)).color;
}

export function buildGradient(distribution: { color: string; count: number }[]): string {
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
