import { ColumnDefinition, KanbanCardItem } from '../types';

export const COLUMNS: ColumnDefinition[] = [
  {
    id: 'todo',
    title: 'To do',
    accent: {
      badgeBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
      badgeText: 'text-zinc-700 dark:text-zinc-300',
      indicator: 'bg-amber-500',
      dragOverBorder: 'border-amber-500/60 ring-2 ring-amber-500/20',
      dragOverBg: 'bg-amber-50/50 dark:bg-amber-950/10',
    },
  },
  {
    id: 'doing',
    title: 'Doing',
    accent: {
      badgeBg: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300',
      badgeText: 'text-sky-700 dark:text-sky-300',
      indicator: 'bg-sky-500',
      dragOverBorder: 'border-sky-500/60 ring-2 ring-sky-500/20',
      dragOverBg: 'bg-sky-50/50 dark:bg-sky-950/10',
    },
  },
  {
    id: 'done',
    title: 'Done',
    accent: {
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      indicator: 'bg-emerald-500',
      dragOverBorder: 'border-emerald-500/60 ring-2 ring-emerald-500/20',
      dragOverBg: 'bg-emerald-50/50 dark:bg-emerald-950/10',
    },
  },
];

export const INITIAL_CARDS: KanbanCardItem[] = [
  {
    id: 'card-1',
    title: 'Design system tokens & typography review',
    description: 'Establish consistent scale ratios, line heights, and neutral palette values.',
    columnId: 'todo',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'card-2',
    title: 'Implement drag preview feedback',
    description: 'Provide clear drop target highlighting when hovering over columns.',
    columnId: 'todo',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'card-3',
    title: 'Refactor state persistence layer',
    description: 'Sync board items to localStorage with fallback initialization.',
    columnId: 'doing',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'card-4',
    title: 'Setup native HTML5 drag and drop handlers',
    description: 'Handle onDragStart, onDragOver (preventDefault), and onDrop without third-party libraries.',
    columnId: 'done',
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
  },
];
