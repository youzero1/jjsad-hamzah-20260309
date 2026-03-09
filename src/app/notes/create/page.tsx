'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm';

export default function CreateNotePage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string;
    isPublic: boolean;
    authorName: string;
  }) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create note');
    }
    const note = await res.json();
    router.push(`/notes/${note.id}`);
  };

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <h1 className="page-title">✏️ Create Note</h1>
        <p className="page-subtitle">Write and save a new note</p>
      </div>
      <NoteForm onSubmit={handleSubmit} submitLabel="Create Note" />
    </div>
  );
}
