import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Types } from 'mongoose'
import ReviewList from '@/components/ReviewList'
import LoadingSpinner from '@/components/LoadingSpinner'
import DeleteButton from '@/components/DeleteButton'
import ReviewForm from '@/components/ReviewForm'
import connectToDatabase from '@/lib/mongodb'
import Book from '@/models/Book'
import { SerializedBook } from '@/types/book'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function BookDetailPage({ params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  // Validierung: ObjectId Format
  if (!Types.ObjectId.isValid(id)) {
    notFound()
  }

  return (
    <div className="book-detail">
      <div className="book-header">
        <Link href="/books" className="back-link">
          ← Zurück zur Bücherliste
        </Link>
        
        <Suspense fallback={<LoadingSpinner />}>
          <BookDetailContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}

// Separate Server Component für Book Detail Content
async function BookDetailContent({ id }: { id: string }) {
  try {
    await connectToDatabase()
    
    const book = await Book.findById(id).lean().exec()
    
    if (!book) {
      notFound()
    }

    // MongoDB Objekte serialisieren für JSON
    const serializedBook: SerializedBook = {
      ...book,
      _id: book._id.toString(),
      createdAt: book.createdAt?.toISOString(),
      updatedAt: book.updatedAt?.toISOString(),
      reviews: book.reviews.map(review => ({
        _id: review._id?.toString(),
        user: review.user,
        comment: review.comment,
        likes: review.likes,
        createdAt: review.createdAt?.toISOString()
      }))
    }

    return (
      <>
        <div className="book-info">
          <div className="book-actions">
            <Link href={`/books/${id}/edit` as any}>
              <button className="edit-btn">✏️ Bearbeiten</button>
            </Link>
            <DeleteButton bookId={serializedBook._id} bookTitle={serializedBook.title} />
          </div>
          
          <h1>{serializedBook.title}</h1>
          <h2 className="author">von {serializedBook.author}</h2>
          
          <div className="book-meta">
            <div className="rating">
              <span className="rating-value">⭐ {serializedBook.rating}</span>
              <span className="review-count">
                ({serializedBook.reviews.length} Rezension{serializedBook.reviews.length !== 1 ? 'en' : ''})
              </span>
            </div>
            
            {/* Virtual Properties anzeigen falls verfügbar */}
            {serializedBook.reviewCount !== undefined && serializedBook.averageReviewRating !== undefined && (
              <div className="virtual-stats">
                <span>Reviews: {serializedBook.reviewCount}</span>
                <span>⌀ Review-Rating: {serializedBook.averageReviewRating.toFixed(1)} ⭐</span>
              </div>
            )}
            
            {serializedBook.publishedYear && (
              <p className="published">Erschienen: {serializedBook.publishedYear}</p>
            )}
            
            {serializedBook.isbn && (
              <p className="isbn">ISBN: {serializedBook.isbn}</p>
            )}

            {serializedBook.createdAt && (
              <p className="created">Hinzugefügt: {new Date(serializedBook.createdAt).toLocaleDateString('de-DE')}</p>
            )}
          </div>

          {serializedBook.description && (
            <div className="description">
              <h3>Beschreibung</h3>
              <p>{serializedBook.description}</p>
            </div>
          )}

          {serializedBook.genre && serializedBook.genre.length > 0 && (
            <div className="genres">
              <h3>Genres</h3>
              <div className="genre-list">
                {serializedBook.genre.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <ReviewForm bookId={id} />
        <ReviewList reviews={serializedBook.reviews} />
      </>
    )
  } catch (error) {
    console.error('Error fetching book:', error)
    return (
      <div className="error-message">
        <p>Fehler beim Laden des Buchs. Bitte versuchen Sie es später erneut.</p>
        <Link href="/books" className="back-link">
          ← Zurück zur Bücherliste
        </Link>
      </div>
    )
  }
}
