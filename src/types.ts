export type ColumnId = 'todo' | 'doing' | 'done';

export interface KanbanCardItem {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  createdAt: number;
}

export interface ColumnDefinition {
  id: ColumnId;
  title: string;
  accent: {
    badgeBg: string;
    badgeText: string;
    indicator: string;
    dragOverBorder: string;
    dragOverBg: string;
  };
}
