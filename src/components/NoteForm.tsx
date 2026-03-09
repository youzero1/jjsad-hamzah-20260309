'use client';

import { useState } from 'react';
import { CreateNoteDto, NoteType, UpdateNoteDto } from '@/types';

interface NoteFormProps {
  initialData?: NoteType;
  onSubmit: (data: CreateNoteDto | UpdateNoteDto) => Promise<void>;
  submitLabel?: string;
}

export default function NoteForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
}: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [authorName, setAuthorName] = useState(initialData?.authorName || '');
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tags.trim() || undefined,
        authorName: authorName.trim() || 'Anonymous',
        isPublic,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Enter note title..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field min-h-[200px] resize-y"
          placeholder="Write your note content here..."
          rows={8}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tags
          <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input-field"
          placeholder="e.g. technology, productivity, ideas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Author Name
        </label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="input-field"
          placeholder="Anonymous"
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <div>
          <p className="text-sm font-medium text-gray-700">
            {isPublic ? '🌍 Public' : '🔒 Private'}
          </p>
          <p className="text-xs text-gray-500">
            {isPublic
              ? 'This note will be visible in the public feed'
              : 'Only you can see this note'}
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
