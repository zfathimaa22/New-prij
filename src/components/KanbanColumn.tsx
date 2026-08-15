import React from 'react';
import { ColumnDefinition, ColumnId, KanbanCardItem } from '../types';
import { KanbanCard } from './KanbanCard';
import { AddCardForm } from './AddCardForm';

interface KanbanColumnProps {
  column: ColumnDefinition;
  cards: KanbanCardItem[];
  isDragOver: boolean;
  draggingCardId: string | null;
  activeAddFormColumn: ColumnId | null;
  setActiveAddFormColumn: (colId: ColumnId | null) => void;
  onUpdateTitle: (cardId: string, newTitle: string) => void;
  onUpdateDescription: (cardId: string, newDesc: string) => void;
  onDeleteCard: (cardId: string) => void;
  onAddCard: (columnId: ColumnId, title: string, description?: string) => void;
  onCardDragStart: (e: React.DragEvent<HTMLDivElement>, card: KanbanCardItem) => void;
  onCardDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onColumnDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: ColumnId) => void;
  onColumnDragEnter: (columnId: ColumnId) => void;
  onColumnDragLeave: (columnId: ColumnId, e: React.DragEvent<HTMLDivElement>) => void;
  onColumnDrop: (e: React.DragEvent<HTMLDivElement>, columnId: ColumnId) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  isDragOver,
  draggingCardId,
  activeAddFormColumn,
  setActiveAddFormColumn,
  onUpdateTitle,
  onUpdateDescription,
  onDeleteCard,
  onAddCard,
  onCardDragStart,
  onCardDragEnd,
  onColumnDragOver,
  onColumnDragEnter,
  onColumnDragLeave,
  onColumnDrop,
}) => {
  return (
    <div
      id={`column-${column.id}`}
      onDragOver={(e) => {
        // Critical requirement: event.preventDefault() so drop event fires
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onColumnDragOver(e, column.id);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        onColumnDragEnter(column.id);
      }}
      onDragLeave={(e) => {
        onColumnDragLeave(column.id, e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onColumnDrop(e, column.id);
      }}
      className={`flex flex-col h-full rounded-xl border bg-zinc-50/70 dark:bg-zinc-900/40 p-3.5 transition-all duration-200 ${
        isDragOver
          ? `${column.accent.dragOverBorder} ${column.accent.dragOverBg} scale-[1.008]`
          : 'border-zinc-200 dark:border-zinc-800'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.accent.indicator}`} />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {column.title}
          </h2>
        </div>
        <span
          id={`column-count-${column.id}`}
          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold ${column.accent.badgeBg}`}
        >
          {cards.length}
        </span>
      </div>

      {/* Cards List Area */}
      <div
        id={`column-card-list-${column.id}`}
        className="flex-1 flex flex-col gap-2.5 overflow-y-auto min-h-[140px] pr-0.5"
      >
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={draggingCardId === card.id}
            onUpdateTitle={onUpdateTitle}
            onUpdateDescription={onUpdateDescription}
            onDelete={onDeleteCard}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
          />
        ))}

        {cards.length === 0 && !isDragOver && (
          <div className="flex-1 flex items-center justify-center py-6 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No cards in this column
            </p>
          </div>
        )}

        {isDragOver && (
          <div className="py-3 px-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/30 rounded-lg text-center animate-pulse">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Drop card here
            </span>
          </div>
        )}
      </div>

      {/* Add Card Form or Trigger Button */}
      <div className="pt-3 mt-auto">
        <AddCardForm
          columnId={column.id}
          isOpen={activeAddFormColumn === column.id}
          onOpen={() => setActiveAddFormColumn(column.id)}
          onClose={() => setActiveAddFormColumn(null)}
          onAddCard={onAddCard}
        />
      </div>
    </div>
  );
};
