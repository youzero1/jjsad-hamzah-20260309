'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">jjsad</Link>
          <ul className="navbar-links">
            <li>
              <Link href="/" className={isActive('/') && pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/notes" className={isActive('/notes') ? 'active' : ''}>
                My Notes
              </Link>
            </li>
            <li>
              <Link href="/feed" className={isActive('/feed') ? 'active' : ''}>
                Public Feed
              </Link>
            </li>
            <li>
              <Link href="/notes/create" className="nav-cta">
                + Create
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
