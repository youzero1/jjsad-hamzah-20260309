'use client';

import Link from 'next/link';
import { NoteType } from '@/types';

interface NoteCardProps {
  note: NoteType;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
  showActions?: boolean;
}

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function NoteCard({
  note,
  onDelete,
  onTogglePublic,
  showActions = false,
}: NoteCardProps) {
  const tags = note.tags
    ? note.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="card flex flex-col h-full">
      <div className="flex justify-between items-start gap-2 mb-3">
        <Link
          href={`/notes/${note.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
        >
          {note.title}
        </Link>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
            note.isPublic
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {note.isPublic ? '🌍' : '🔒'}
        </span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{note.content}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="tag-badge bg-gray-100 text-gray-600">+{tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <span>👤 {note.authorName}</span>
        <span>{formatDate(note.createdAt)}</span>
      </div>

      {note.isPublic && (
        <div className="text-xs text-gray-500 mb-3">❤️ {note.likes} likes</div>
      )}

      {showActions && (
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Link
            href={`/notes/${note.id}/edit`}
            className="flex-1 text-center text-sm py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
          >
            Edit
          </Link>
          {onTogglePublic && (
            <button
              onClick={() => onTogglePublic(note.id, note.isPublic)}
              className="flex-1 text-sm py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              {note.isPublic ? 'Privatize' : 'Share'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="text-sm py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
