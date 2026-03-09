export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <span>
            <span className="footer-brand">jjsad</span> – Social Note Taking
          </span>
          <span>© {year} · Built with Next.js &amp; TypeORM</span>
        </div>
      </div>
    </footer>
  );
}
