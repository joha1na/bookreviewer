import BookCard from '@/components/BookCard'
import { getAllBooks, getBookStats } from '@/lib/books-data'

export default function BooksPage() {
  const books = getAllBooks()
  const stats = getBookStats()

  return (
    <div>
      <div className="page-header">
        <h1>Alle Bücher</h1>
        <div className="stats">
          <span>{stats.totalBooks} Bücher</span>
          <span>{stats.totalReviews} Rezensionen</span>
          <span>⌀ {stats.averageRating} ⭐</span>
        </div>
      </div>
      
      <div className="books-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
