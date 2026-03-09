'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NoteList from '@/components/NoteList';

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

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete note.');
    }
  };

  const handleTogglePublic = async (id: string, currentState: boolean) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentState }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
    } catch (err) {
      console.error(err);
      alert('Failed to update note visibility.');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = search === '' || 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = tagFilter === '' || 
      note.tags.split(',').map(t => t.trim()).some(t => t.toLowerCase().includes(tagFilter.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(
    notes.flatMap(n => n.tags ? n.tags.split(',').map(t => t.trim()).filter(Boolean) : [])
  ));

  return (
    <div className="container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">📋 My Notes</h1>
            <p className="page-subtitle">
              {notes.length} note{notes.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link href="/notes/create" className="btn btn-primary">
            ✏️ New Note
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {allTags.length > 0 && (
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
          >
            <option value="">All tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}
        {(search || tagFilter) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setTagFilter(''); }}>
            Clear
          </button>
        )}
      </div>

      <NoteList
        notes={filteredNotes}
        loading={loading}
        onDelete={handleDelete}
        onTogglePublic={handleTogglePublic}
        showActions
        emptyMessage={search || tagFilter ? 'No notes match your search.' : 'You have no notes yet. Create one!'}
        emptyAction={!search && !tagFilter ? { label: '✏️ Create your first note', href: '/notes/create' } : undefined}
      />
    </div>
  );
}
