import React, { useState, useRef, useEffect } from 'react';
import { KanbanCardItem } from '../types';
import { Trash2, GripVertical, Check, X, Pencil, AlignLeft } from 'lucide-react';

interface KanbanCardProps {
  card: KanbanCardItem;
  onUpdateTitle: (cardId: string, newTitle: string) => void;
  onUpdateDescription: (cardId: string, newDesc: string) => void;
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, card: KanbanCardItem) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onUpdateTitle,
  onUpdateDescription,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(card.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(card.description || '');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitleDraft(card.title);
  }, [card.title]);

  useEffect(() => {
    setDescDraft(card.description || '');
  }, [card.description]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc && descInputRef.current) {
      descInputRef.current.focus();
    }
  }, [isEditingDesc]);

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) {
      onUpdateTitle(card.id, trimmed);
    } else {
      setTitleDraft(card.title);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTitleDraft(card.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelTitle();
    }
  };

  const handleSaveDesc = () => {
    onUpdateDescription(card.id, descDraft.trim());
    setIsEditingDesc(false);
  };

  const handleCancelDesc = () => {
    setDescDraft(card.description || '');
    setIsEditingDesc(false);
  };

  const handleDescKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSaveDesc();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelDesc();
    }
  };

  return (
    <div
      id={`card-${card.id}`}
      draggable={!isEditingTitle && !isEditingDesc}
      onDragStart={(e) => onDragStart(e, card)}
      onDragEnd={onDragEnd}
      className={`group relative bg-white dark:bg-zinc-900 rounded-lg border p-3.5 shadow-xs transition-all duration-150 ${
        isDragging
          ? 'opacity-40 scale-[0.98] border-dashed border-zinc-400 dark:border-zinc-600 shadow-none'
          : 'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm'
      } ${!isEditingTitle && !isEditingDesc ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      {/* Top row: Drag handle & Action buttons */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <input
                ref={titleInputRef}
                id={`card-title-input-${card.id}`}
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleSaveTitle}
                className="w-full text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 outline-hidden focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                placeholder="Card title..."
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  id={`save-title-btn-${card.id}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSaveTitle();
                  }}
                  className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Save title (Enter)"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  id={`cancel-title-btn-${card.id}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCancelTitle();
                  }}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Cancel (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              id={`card-title-view-${card.id}`}
              onClick={() => setIsEditingTitle(true)}
              className="group/title flex items-start justify-between gap-1 cursor-pointer"
              title="Click to edit title"
            >
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover/title:text-zinc-700 dark:group-hover/title:text-zinc-200">
                {card.title}
              </h3>
              <Pencil className="w-3 h-3 text-zinc-400 opacity-0 group-hover/title:opacity-100 shrink-0 mt-0.5 transition-opacity" />
            </div>
          )}
        </div>

        {/* Card action buttons */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            id={`delete-card-${card.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div
            className="p-1 text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 cursor-grab active:cursor-grabbing"
            title="Drag card"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="mt-2 text-xs">
        {isEditingDesc ? (
          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
            <textarea
              ref={descInputRef}
              id={`card-desc-input-${card.id}`}
              rows={2}
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              onKeyDown={handleDescKeyDown}
              onBlur={handleSaveDesc}
              placeholder="Add short description..."
              className="w-full text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-600 rounded p-2 outline-hidden focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
            />
            <div className="flex justify-end gap-1 mt-1">
              <button
                type="button"
                id={`cancel-desc-btn-${card.id}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCancelDesc();
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id={`save-desc-btn-${card.id}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSaveDesc();
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : card.description ? (
          <p
            id={`card-desc-view-${card.id}`}
            onClick={() => setIsEditingDesc(true)}
            className="text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            title="Click to edit description"
          >
            {card.description}
          </p>
        ) : (
          <button
            type="button"
            id={`add-desc-btn-${card.id}`}
            onClick={() => setIsEditingDesc(true)}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors py-0.5"
          >
            <AlignLeft className="w-3 h-3" />
            <span>Add description</span>
          </button>
        )}
      </div>
    </div>
  );
};
