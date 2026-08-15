import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { ColumnId } from '../types';

interface AddCardFormProps {
  columnId: ColumnId;
  onAddCard: (columnId: ColumnId, title: string, description?: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({
  columnId,
  onAddCard,
  isOpen,
  onOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddCard(columnId, trimmedTitle, description.trim() || undefined);
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        id={`open-add-card-${columnId}`}
        onClick={onOpen}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add a card</span>
      </button>
    );
  }

  return (
    <form
      id={`add-card-form-${columnId}`}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-xs space-y-2.5"
    >
      <div>
        <label htmlFor={`new-card-title-${columnId}`} className="sr-only">
          Card title
        </label>
        <input
          ref={titleInputRef}
          id={`new-card-title-${columnId}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Card title..."
          className="w-full text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-600 rounded px-2.5 py-1.5 outline-hidden focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder:text-zinc-400"
          required
        />
      </div>

      <div>
        <label htmlFor={`new-card-desc-${columnId}`} className="sr-only">
          Short description (optional)
        </label>
        <textarea
          id={`new-card-desc-${columnId}`}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (optional)..."
          className="w-full text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-600 rounded p-2 outline-hidden focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder:text-zinc-400 resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            id={`submit-add-card-${columnId}`}
            disabled={!title.trim()}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add card
          </button>
          <button
            type="button"
            id={`cancel-add-card-${columnId}`}
            onClick={() => {
              setTitle('');
              setDescription('');
              onClose();
            }}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <span className="text-[11px] text-zinc-400">Esc to cancel</span>
      </div>
    </form>
  );
};
