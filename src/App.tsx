/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ColumnId, KanbanCardItem } from './types';
import { COLUMNS, INITIAL_CARDS } from './data/defaultCards';
import { KanbanColumn } from './components/KanbanColumn';
import {
  Kanban,
  RotateCcw,
  Plus,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

const STORAGE_KEY = 'kanban_board_tasks_v1';

export default function App() {
  // Load initial cards from localStorage or fall back to INITIAL_CARDS
  const [cards, setCards] = useState<KanbanCardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse cards from localStorage:', e);
    }
    return INITIAL_CARDS;
  });

  // Save to localStorage whenever cards change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards to localStorage:', e);
    }
  }, [cards]);

  // Drag-and-drop state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const dragEnterCounters = useRef<Record<string, number>>({});

  // Active inline add-form in a column
  const [activeAddFormColumn, setActiveAddFormColumn] = useState<ColumnId | null>(null);

  // Search/filter query for quick scanning
  const [searchQuery, setSearchQuery] = useState('');

  // Native HTML5 Drag Handlers
  const handleCardDragStart = (e: React.DragEvent<HTMLDivElement>, card: KanbanCardItem) => {
    setDraggingCardId(card.id);
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDragEnd = () => {
    setDraggingCardId(null);
    setDragOverColumn(null);
    dragEnterCounters.current = {};
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    // CRITICAL: event.preventDefault() enables the drop event to fire!
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleColumnDragEnter = (columnId: ColumnId) => {
    dragEnterCounters.current[columnId] = (dragEnterCounters.current[columnId] || 0) + 1;
    setDragOverColumn(columnId);
  };

  const handleColumnDragLeave = (columnId: ColumnId, e: React.DragEvent<HTMLDivElement>) => {
    dragEnterCounters.current[columnId] = (dragEnterCounters.current[columnId] || 1) - 1;
    if (dragEnterCounters.current[columnId] <= 0) {
      dragEnterCounters.current[columnId] = 0;
      // Only reset if we're not entering another element within the column
      if (dragOverColumn === columnId) {
        setDragOverColumn(null);
      }
    }
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: ColumnId) => {
    e.preventDefault();
    const droppedCardId = e.dataTransfer.getData('text/plain') || draggingCardId;

    if (droppedCardId) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === droppedCardId ? { ...card, columnId: targetColumnId } : card
        )
      );
    }

    setDraggingCardId(null);
    setDragOverColumn(null);
    dragEnterCounters.current = {};
  };

  // Card Operations
  const handleAddCard = (columnId: ColumnId, title: string, description?: string) => {
    const newCard: KanbanCardItem = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      description,
      columnId,
      createdAt: Date.now(),
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleUpdateTitle = (cardId: string, newTitle: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, title: newTitle } : c))
    );
  };

  const handleUpdateDescription = (cardId: string, newDesc: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, description: newDesc } : c))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleResetSampleData = () => {
    setCards(INITIAL_CARDS);
  };

  // Filtered cards based on optional search
  const filteredCards = cards.filter((card) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      (card.description && card.description.toLowerCase().includes(query))
    );
  });

  const totalCards = cards.length;
  const doneCount = cards.filter((c) => c.columnId === 'done').length;

  return (
    <div className="min-h-screen bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <header
        id="app-header"
        className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-10 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xs">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Kanban Board
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium border border-zinc-200 dark:border-zinc-700">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Drag cards across columns • Click title to edit • Local persistence
              </p>
            </div>
          </div>

          {/* Header Controls & Stats */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Board Progress Pill */}
            <div
              id="board-stats-pill"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {doneCount} of {totalCards} completed
              </span>
            </div>

            {/* Quick Add Card to 'To do' */}
            <button
              type="button"
              id="global-add-card-btn"
              onClick={() => setActiveAddFormColumn('todo')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New card</span>
            </button>

            {/* Reset Sample Data Button */}
            <button
              type="button"
              id="reset-sample-data-btn"
              onClick={handleResetSampleData}
              title="Reset to default sample cards"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Grid Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Three Fixed Columns Grid */}
        <div
          id="kanban-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-start min-h-[500px]"
        >
          {COLUMNS.map((col) => {
            const columnCards = filteredCards.filter((card) => card.columnId === col.id);
            const isOver = dragOverColumn === col.id;

            return (
              <div key={col.id} className="h-full">
                <KanbanColumn
                  column={col}
                  cards={columnCards}
                  isDragOver={isOver}
                  draggingCardId={draggingCardId}
                  activeAddFormColumn={activeAddFormColumn}
                  setActiveAddFormColumn={setActiveAddFormColumn}
                  onUpdateTitle={handleUpdateTitle}
                  onUpdateDescription={handleUpdateDescription}
                  onDeleteCard={handleDeleteCard}
                  onAddCard={handleAddCard}
                  onCardDragStart={handleCardDragStart}
                  onCardDragEnd={handleCardDragEnd}
                  onColumnDragOver={handleColumnDragOver}
                  onColumnDragEnter={handleColumnDragEnter}
                  onColumnDragLeave={handleColumnDragLeave}
                  onColumnDrop={handleColumnDrop}
                />
              </div>
            );
          })}
        </div>

        {/* Drag Helper Footer Tip */}
        <footer className="mt-8 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Built with native HTML5 Drag & Drop API • Fully responsive • Stored in browser localStorage
        </footer>
      </main>
    </div>
  );
}
