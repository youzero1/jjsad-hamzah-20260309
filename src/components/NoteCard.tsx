'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShareButton from './ShareButton';

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

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, current: boolean) => void;
  showActions?: boolean;
}

export default function NoteCard({ note, onDelete, onTogglePublic, showActions = false }: NoteCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <>
      <div className="note-card">
        <div className="note-card-header">
          <Link href={`/notes/${note.id}`} style={{ textDecoration: 'none', flex: 1 }}>
            <h3 className="note-card-title">{note.title}</h3>
          </Link>
          <span className={`badge ${note.isPublic ? 'badge-public' : 'badge-private'}`}>
            {note.isPublic ? '🌐' : '🔒'}
          </span>
        </div>

        <p className="note-card-content">{note.content}</p>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="note-card-meta">
          <span>✍️ {note.authorName}</span>
          <span>•</span>
          <span>{formatDate(note.createdAt)}</span>
        </div>

        {showActions && (
          <div className="note-card-actions">
            <Link href={`/notes/${note.id}`} className="btn btn-secondary btn-sm">View</Link>
            <Link href={`/notes/${note.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
            {onTogglePublic && (
              <ShareButton
                isPublic={note.isPublic}
                onToggle={() => onTogglePublic(note.id, note.isPublic)}
                size="sm"
              />
            )}
            {onDelete && (
              <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="dialog-overlay" onClick={() => setShowConfirm(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3>Delete Note?</h3>
            <p>Are you sure you want to delete &ldquo;{note.title}&rdquo;? This cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onDelete?.(note.id);
                  setShowConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
