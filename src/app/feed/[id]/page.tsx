'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function FeedNoteDetailPage() {
  const params = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (!res.ok) {
          setError('Note not found.');
          return;
        }
        const data = await res.json();
        if (!data.isPublic) {
          setError('This note is private.');
          return;
        }
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
          <p>Loading...</p>
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
          <Link href="/feed" className="btn btn-primary">← Back to Feed</Link>
        </div>
      </div>
    );
  }

  const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/feed" className="btn btn-secondary btn-sm">← Back to Feed</Link>
      </div>

      <div className="note-detail">
        <div className="note-detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 className="note-detail-title">{note.title}</h1>
            <span className="badge badge-public">🌐 Public</span>
          </div>
          <div className="note-detail-meta">
            <span>✍️ {note.authorName}</span>
            <span>•</span>
            <span>📅 {formatDate(note.createdAt)}</span>
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
      </div>
    </div>
  );
}
