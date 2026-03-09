'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm';
import { CreateNoteDto } from '@/types';

export default function CreateNotePage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateNoteDto) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create note');
    }
    router.push('/notes');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Note</h1>
      <NoteForm onSubmit={handleSubmit} submitLabel="Create Note" />
    </div>
  );
}
