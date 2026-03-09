'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NoteForm from '@/components/NoteForm';

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

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
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

  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string;
    isPublic: boolean;
    authorName: string;
  }) => {
    const res = await fetch(`/api/notes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update note');
    }
    router.push(`/notes/${params.id}`);
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
          <Link href="/notes" className="btn btn-primary">← Back to Notes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/notes/${note.id}`} className="btn btn-secondary btn-sm">← Back to Note</Link>
      </div>
      <div className="page-header">
        <h1 className="page-title">✏️ Edit Note</h1>
        <p className="page-subtitle">Update your note</p>
      </div>
      <NoteForm
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        initialValues={{
          title: note.title,
          content: note.content,
          tags: note.tags || '',
          isPublic: note.isPublic,
          authorName: note.authorName,
        }}
      />
    </div>
  );
}
