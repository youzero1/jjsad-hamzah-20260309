'use client';

import { useState } from 'react';

interface ShareButtonProps {
  noteId: string;
  isPublic: boolean;
  onToggle?: (isPublic: boolean) => void;
}

export default function ShareButton({ noteId, isPublic, onToggle }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [currentIsPublic, setCurrentIsPublic] = useState(isPublic);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${noteId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentIsPublic }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const newValue = !currentIsPublic;
      setCurrentIsPublic(newValue);
      onToggle?.(newValue);
    } catch {
      alert('Failed to update note visibility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
        currentIsPublic
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span>{currentIsPublic ? '🌍' : '🔒'}</span>
      )}
      {currentIsPublic ? 'Public' : 'Private'}
    </button>
  );
}
