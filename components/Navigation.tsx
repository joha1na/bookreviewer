import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="logo">
          📚 BookReviewer
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link href="/books" className="nav-link">
              Alle Bücher
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-link">
              Über uns
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
