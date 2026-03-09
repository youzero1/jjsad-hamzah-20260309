'use client';

import { useState, useEffect } from 'react';
import { NoteType } from '@/types';
import Link from 'next/link';

function timeAgo(dateStr: string | Date) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function FeedPage() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const res = await fetch('/api/notes/public');
        if (!res.ok) throw new Error('Failed to fetch feed');
        const data = await res.json();
        setNotes(data.data || []);
      } catch {
        setError('Failed to load public feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicNotes();

    const stored = localStorage.getItem('likedNotes');
    if (stored) setLikedIds(new Set(JSON.parse(stored)));
  }, []);

  const handleLike = async (id: string) => {
    if (likedIds.has(id)) return;
    try {
      const res = await fetch(`/api/notes/${id}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ like: true }),
      });
      if (!res.ok) throw new Error('Failed to like');
      const newLiked = new Set(likedIds);
      newLiked.add(id);
      setLikedIds(newLiked);
      localStorage.setItem('likedNotes', JSON.stringify(Array.from(newLiked)));
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
      );
    } catch {
      alert('Failed to like note.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌍 Public Feed</h1>
        <p className="text-gray-600">Discover notes shared by the community</p>
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
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No public notes yet</h3>
          <p className="text-gray-500 mb-6">Be the first to share a note with the community!</p>
          <Link href="/notes/create" className="btn-primary">Create & Share a Note</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {notes.map((note) => {
            const tags = note.tags ? note.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
            const liked = likedIds.has(note.id);
            return (
              <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {note.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{note.authorName}</p>
                    <p className="text-xs text-gray-500">{timeAgo(note.createdAt)}</p>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2">{note.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 whitespace-pre-wrap">{note.content}</p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <span key={tag} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(note.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      liked
                        ? 'bg-red-50 text-red-500 cursor-default'
                        : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                    disabled={liked}
                  >
                    <span>{liked ? '❤️' : '🤍'}</span>
                    <span>{note.likes} {note.likes === 1 ? 'like' : 'likes'}</span>
                  </button>
                  <span className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
