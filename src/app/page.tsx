import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">Think. Write. Share.</h1>
        <p className="hero-subtitle">
          jjsad is your personal note-taking space with a social twist.
          Capture your thoughts privately or share them with the world.
        </p>
        <div className="hero-actions">
          <Link href="/notes/create" className="btn btn-primary btn-lg">
            ✏️ Start Writing
          </Link>
          <Link href="/feed" className="btn btn-secondary btn-lg">
            🌐 Explore Feed
          </Link>
        </div>
      </section>

      <hr className="section-divider" />

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <div className="feature-title">Rich Notes</div>
          <p className="feature-desc">
            Write multi-line notes with titles, body content, and custom tags to stay organized.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <div className="feature-title">Privacy Control</div>
          <p className="feature-desc">
            Keep notes private by default. Publish them publicly when you&apos;re ready to share.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <div className="feature-title">Public Feed</div>
          <p className="feature-desc">
            Discover and read notes shared by others in a real-time chronological feed.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <div className="feature-title">Search & Filter</div>
          <p className="feature-desc">
            Quickly find your notes by searching titles or filtering by tags.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <div className="feature-title">Instant Updates</div>
          <p className="feature-desc">
            Edit and update your notes in real time with a fast, smooth interface.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <div className="feature-title">Responsive Design</div>
          <p className="feature-desc">
            Access your notes seamlessly from desktop, tablet, or mobile device.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
        <Link href="/notes" className="btn btn-secondary btn-lg">
          📋 My Notes
        </Link>
      </div>
    </div>
  );
}
