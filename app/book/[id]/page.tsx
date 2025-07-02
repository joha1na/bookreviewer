import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewList from '@/components/ReviewList'
import { getBookById } from '@/lib/books-data'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function BookDetailPage({ params }: Props) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)
  const book = getBookById(id)

  if (!book) {
    notFound()
  }

  return (
    <div className="book-detail">
      <div className="book-header">
        <Link href="/books" className="back-link">
          ← Zurück zur Bücherliste
        </Link>
        
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2 className="author">von {book.author}</h2>
          
          <div className="book-meta">
            <div className="rating">
              <span className="rating-value">⭐ {book.rating}</span>
              <span className="review-count">
                ({book.reviews.length} Rezension{book.reviews.length !== 1 ? 'en' : ''})
              </span>
            </div>
            
            {book.publishedYear && (
              <p className="published">Erschienen: {book.publishedYear}</p>
            )}
            
            {book.isbn && (
              <p className="isbn">ISBN: {book.isbn}</p>
            )}
          </div>

          {book.description && (
            <div className="description">
              <h3>Beschreibung</h3>
              <p>{book.description}</p>
            </div>
          )}

          {book.genre && book.genre.length > 0 && (
            <div className="genres">
              <h3>Genres</h3>
              <div className="genre-list">
                {book.genre.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewList reviews={book.reviews} />
    </div>
  )
}
