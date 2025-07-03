import BookForm from '@/components/BookForm'
import Link from 'next/link'

export default function CreateBookPage() {
  return (
    <div>
      <div className="page-header">
        <Link href="/books" className="back-link">
          ← Zurück zur Bücherliste
        </Link>
      </div>
      
      <BookForm mode="create" />
    </div>
  )
}
