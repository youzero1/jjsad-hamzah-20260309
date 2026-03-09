'use client';

import { useState, useEffect, useCallback } from 'react';
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

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return <div className="author-avatar">{initials}</div>;
}

function FeedNoteCard({ note }: { note: Note }) {
  const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <div className="feed-author">
          <AuthorAvatar name={note.authorName} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{note.authorName}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(note.createdAt)}</div>
          </div>
        </div>
        <span className="badge badge-public">🌐 Public</span>
      </div>

      <Link href={`/feed/${note.id}`} style={{ textDecoration: 'none' }}>
        <h3 className="note-card-title" style={{ cursor: 'pointer' }}>{note.title}</h3>
      </Link>

      <p className="note-card-content">{note.content}</p>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="note-card-meta">
        <Link href={`/feed/${note.id}`} className="btn btn-secondary btn-sm">Read more →</Link>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notes?public=true');
      if (!res.ok) throw new Error('Failed to fetch feed');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to load feed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const filteredNotes = notes.filter(note =>
    search === '' ||
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    note.authorName.toLowerCase().includes(search.toLowerCase()) ||
    (note.tags && note.tags.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🌐 Public Feed</h1>
        <p className="page-subtitle">
          Discover notes shared by the community · {notes.length} public note{notes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-filter-bar">
        <div className="search-input-wrapper" style={{ flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search public notes, authors, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>Clear</button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading feed...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>{search ? 'No results found' : 'Feed is empty'}</h3>
          <p>
            {search
              ? 'Try different search terms.'
              : 'No public notes yet. Be the first to share!'}
          </p>
          <Link href="/notes/create" className="btn btn-primary">✏️ Share a Note</Link>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <FeedNoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
