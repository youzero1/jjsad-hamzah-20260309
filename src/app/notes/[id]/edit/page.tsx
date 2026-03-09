'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NoteForm from '@/components/NoteForm';
import { NoteType, UpdateNoteDto } from '@/types';

export default function EditNotePage() {
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

  const handleSubmit = async (data: UpdateNoteDto) => {
    const res = await fetch(`/api/notes/${params.id}`, {
      method: 'PATCH',
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
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{error || 'Note not found'}</h3>
        <Link href="/notes" className="btn-primary">Back to Notes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/notes/${note.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Back to Note
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Note</h1>
      <NoteForm
        initialData={note}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
