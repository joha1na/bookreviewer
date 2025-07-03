import BookCard from '@/components/BookCard'
import connectToDatabase from '@/lib/mongodb'
import Book from '@/models/Book'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { SerializedBook } from '@/types/book'
import CreateBookButton from '@/components/CreateBookButton'

// Force dynamic rendering für searchParams
export const dynamic = 'force-dynamic'

// Server Component - läuft auf dem Server und kann direkt auf MongoDB zugreifen
export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; genre?: string; author?: string; page?: string }>
}) {
  return (
    <div>
      <div className="page-header">
        <h1>Alle Bücher</h1>
        <CreateBookButton />
        <Suspense fallback={<div>Loading stats...</div>}>
          <BookStats />
        </Suspense>
      </div>
      
      <Suspense fallback={<LoadingSpinner />}>
        <BooksList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

// Separate Server Component für Book Statistics
async function BookStats() {
  try {
    await connectToDatabase()
    
    const totalBooks = await Book.countDocuments()
    const booksWithReviews = await Book.aggregate([
      { $match: { reviews: { $ne: [] } } },
      { $project: { reviewCount: { $size: '$reviews' } } },
      { $group: { _id: null, totalReviews: { $sum: '$reviewCount' } } }
    ])
    
    const avgRating = await Book.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ])

    const totalReviews = booksWithReviews[0]?.totalReviews || 0
    const averageRating = avgRating[0]?.averageRating || 0

    return (
      <div className="stats">
        <span>{totalBooks} Bücher</span>
        <span>{totalReviews} Rezensionen</span>
        <span>⌀ {averageRating.toFixed(1)} ⭐</span>
      </div>
    )
  } catch (error) {
    console.error('Error fetching book stats:', error)
    return <div className="stats">Statistiken nicht verfügbar</div>
  }
}

// Separate Server Component für Books List
async function BooksList({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string; genre?: string; author?: string; page?: string }>
}) {
  try {
    await connectToDatabase()
    
    const resolvedSearchParams = await searchParams
    const page = parseInt(resolvedSearchParams.page || '1')
    const limit = 12
    const skip = (page - 1) * limit
    
    // Query-Objekt aufbauen basierend auf Search Params
    let query: any = {}
    
    if (resolvedSearchParams.search) {
      query.$text = { $search: resolvedSearchParams.search }
    }
    
    if (resolvedSearchParams.author) {
      query.author = { $regex: resolvedSearchParams.author, $options: 'i' }
    }
    
    if (resolvedSearchParams.genre) {
      query.genre = { $in: [resolvedSearchParams.genre] }
    }
    
    // Bücher abrufen
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() // Für bessere Performance
      .exec()
    
    const totalBooks = await Book.countDocuments(query)
    const totalPages = Math.ceil(totalBooks / limit)
    
    // MongoDB _id in string konvertieren für JSON serialization
    const serializedBooks: SerializedBook[] = books.map(book => ({
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
    }))

    return (
      <>
        <div className="books-grid">
          {serializedBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <p>Seite {page} von {totalPages} ({totalBooks} Bücher gesamt)</p>
            {/* TODO: Add pagination controls */}
          </div>
        )}
        
        {serializedBooks.length === 0 && (
          <div className="no-results">
            <p>Keine Bücher gefunden.</p>
          </div>
        )}
      </>
    )
  } catch (error) {
    console.error('Error fetching books:', error)
    return (
      <div className="error-message">
        <p>Fehler beim Laden der Bücher. Bitte versuchen Sie es später erneut.</p>
      </div>
    )
  }
}
