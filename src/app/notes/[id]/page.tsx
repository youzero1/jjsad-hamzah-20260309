'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NoteType } from '@/types';

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<NoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (!res.ok) throw new Error('Note not found');
        const data = await res.json();
        setNote(data.data);
      } catch {
        setError('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchNote();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/notes');
    } catch {
      alert('Failed to delete note.');
    }
  };

  const handleTogglePublic = async () => {
    if (!note) return;
    try {
      const res = await fetch(`/api/notes/${note.id}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !note.isPublic }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setNote({ ...note, isPublic: !note.isPublic });
    } catch {
      alert('Failed to update note visibility.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{error || 'Note not found'}</h3>
        <Link href="/notes" className="btn-primary">Back to Notes</Link>
      </div>
    );
  }

  const tags = note.tags ? note.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/notes" className="text-blue-600 hover:text-blue-800 text-sm font-medium">← Back to Notes</Link>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            note.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {note.isPublic ? '🌍 Public' : '🔒 Private'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>👤 {note.authorName}</span>
          <span>📅 {formatDate(note.createdAt)}</span>
          {note.isPublic && <span>❤️ {note.likes} likes</span>}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
          <Link href={`/notes/${note.id}/edit`} className="btn-secondary">
            ✏️ Edit
          </Link>
          <button onClick={handleTogglePublic} className="btn-secondary">
            {note.isPublic ? '🔒 Make Private' : '🌍 Make Public'}
          </button>
          <button onClick={handleDelete} className="btn-danger">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
