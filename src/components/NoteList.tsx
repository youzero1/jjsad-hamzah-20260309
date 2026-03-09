import NoteCard from './NoteCard';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string;
  isPublic: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  notes: Note[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, current: boolean) => void;
  showActions?: boolean;
  emptyMessage?: string;
  emptyAction?: { label: string; href: string };
}

export default function NoteList({
  notes,
  loading,
  onDelete,
  onTogglePublic,
  showActions,
  emptyMessage = 'No notes found.',
  emptyAction,
}: NoteListProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>Nothing here yet</h3>
        <p>{emptyMessage}</p>
        {emptyAction && (
          <Link href={emptyAction.href} className="btn btn-primary">
            {emptyAction.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
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
