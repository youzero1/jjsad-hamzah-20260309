'use client';

import { NoteType } from '@/types';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: NoteType[];
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
  showActions?: boolean;
}

export default function NoteList({
  notes,
  onDelete,
  onTogglePublic,
  showActions = false,
}: NoteListProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onTogglePublic={onTogglePublic}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
