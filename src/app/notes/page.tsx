'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NoteCard from '@/components/NoteCard';
import { NoteType } from '@/types';

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [error, setError] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterTag) params.append('tag', filterTag);
      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data.data || []);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, filterTag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert('Failed to delete note.');
    }
  };

  const handleTogglePublic = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/notes/${id}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (!res.ok) throw new Error('Failed to update visibility');
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isPublic: !isPublic } : n))
      );
    } catch (err) {
      alert('Failed to update note visibility.');
    }
  };

  const allTags = Array.from(
    new Set(
      notes
        .flatMap((n) => (n.tags ? n.tags.split(',').map((t) => t.trim()) : []))
        .filter(Boolean)
    )
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <Link href="/notes/create" className="btn-primary">
          + Create Note
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:max-w-xs"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="input-field sm:max-w-xs"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
          <p className="text-gray-500 mb-6">
            {search || filterTag ? 'Try adjusting your filters.' : 'Start by creating your first note!'}
          </p>
          <Link href="/notes/create" className="btn-primary">
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onTogglePublic={handleTogglePublic}
              showActions
            />
          ))}
        </div>
      )}
    </div>
  );
}
