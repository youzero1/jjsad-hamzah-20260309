'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';

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

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) setError('Note not found.');
          else setError('Failed to load note.');
          return;
        }
        const data = await res.json();
        setNote(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/notes');
    } catch (err) {
      console.error(err);
      alert('Failed to delete note.');
      setDeleting(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!note) return;
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !note.isPublic }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setNote(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to update visibility.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>{error || 'Note not found'}</h3>
          <p>The note you&apos;re looking for doesn&apos;t exist or was deleted.</p>
          <Link href="/notes" className="btn btn-primary">← Back to Notes</Link>
        </div>
      </div>
    );
  }

  const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/notes" className="btn btn-secondary btn-sm">← Back to Notes</Link>
      </div>

      <div className="note-detail">
        <div className="note-detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 className="note-detail-title">{note.title}</h1>
            <span className={`badge ${note.isPublic ? 'badge-public' : 'badge-private'}`}>
              {note.isPublic ? '🌐 Public' : '🔒 Private'}
            </span>
          </div>
          <div className="note-detail-meta">
            <span>✍️ {note.authorName}</span>
            <span>•</span>
            <span>📅 {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <>
                <span>•</span>
                <span>✏️ Edited {formatDate(note.updatedAt)}</span>
              </>
            )}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="note-detail-tags">
            {tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="note-detail-content">{note.content}</div>

        <div className="note-detail-actions">
          <Link href={`/notes/${note.id}/edit`} className="btn btn-secondary">
            ✏️ Edit
          </Link>
          <ShareButton isPublic={note.isPublic} onToggle={handleTogglePublic} />
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="dialog-overlay" onClick={() => setShowConfirm(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3>Delete Note?</h3>
            <p>This action cannot be undone. The note &ldquo;{note.title}&rdquo; will be permanently deleted.</p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
