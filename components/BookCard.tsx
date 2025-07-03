import Link from 'next/link'
import { SerializedBook } from '@/types/book'

interface BookCardProps {
  book: SerializedBook
}

export default function BookCard({ book }: BookCardProps) {
  // Support für sowohl _id (MongoDB) als auch id (Legacy)
  const bookId = book._id || (book as any).id
  
  return (
    <div className="book-card">
      <Link href={`/book/${bookId}`} className="book-link">
        <h3>{book.title}</h3>
      </Link>
      
      <div className="book-meta">
        <p className="author">von {book.author}</p>
        {book.publishedYear && (
          <p className="year">({book.publishedYear})</p>
        )}
      </div>

      <div className="rating">
        <span className="rating-value">⭐ {book.rating}</span>
        <span className="review-count">
          ({book.reviews.length} Rezension{book.reviews.length !== 1 ? 'en' : ''})
        </span>
      </div>

      {book.description && (
        <p className="description">{book.description.substring(0, 150)}...</p>
      )}

      {book.genre && book.genre.length > 0 && (
        <div className="genres">
          {book.genre.slice(0, 3).map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
