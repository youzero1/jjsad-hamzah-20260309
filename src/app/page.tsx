import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to{' '}
          <span className="text-blue-600">{process.env.NEXT_PUBLIC_APP_NAME || 'jjsad'}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your social note-taking platform. Create, organize, and share your thoughts with the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/notes/create"
            className="btn-primary text-lg py-3 px-8 inline-block"
          >
            ✏️ Create a Note
          </Link>
          <Link
            href="/feed"
            className="btn-secondary text-lg py-3 px-8 inline-block"
          >
            🌍 Browse Public Feed
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card text-left">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Notes</h3>
            <p className="text-gray-600 text-sm">
              Write and organize your thoughts with titles, content, and tags.
            </p>
          </div>
          <div className="card text-left">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Private & Public</h3>
            <p className="text-gray-600 text-sm">
              Keep notes private or share them publicly for others to discover.
            </p>
          </div>
          <div className="card text-left">
            <div className="text-3xl mb-3">❤️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Like & Engage</h3>
            <p className="text-gray-600 text-sm">
              React to public notes and see what the community is sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
