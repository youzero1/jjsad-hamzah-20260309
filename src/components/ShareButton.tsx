'use client';

import { useState } from 'react';

interface ShareButtonProps {
  isPublic: boolean;
  onToggle: () => Promise<void> | void;
  size?: 'sm' | 'md';
}

export default function ShareButton({ isPublic, onToggle, size = 'md' }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onToggle();
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const btnClass = `btn ${isPublic ? 'btn-secondary' : 'btn-success'} ${size === 'sm' ? 'btn-sm' : ''}`;

  return (
    <button
      className={btnClass}
      onClick={handleClick}
      disabled={loading}
      title={isPublic ? 'Make private' : 'Share publicly'}
    >
      {loading ? '...' : showFeedback ? '✅ Done!' : isPublic ? '🔒 Make Private' : '🌐 Share'}
    </button>
  );
}
