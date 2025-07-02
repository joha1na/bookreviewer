import Link from 'next/link'

// Temporäre Daten (werden später durch API ersetzt)
const books = [
  { 
    id: 1, 
    title: 'Der kleine Prinz', 
    author: 'Antoine de Saint-Exupéry', 
    rating: 4.8, 
    reviews: [
      { user: 'Anna', comment: 'Wundervoll!', likes: 5 },
      { user: 'Tom', comment: 'Sehr tiefgründig', likes: 2 }
    ] 
  },
  { 
    id: 2, 
    title: 'Harry Potter', 
    author: 'J.K. Rowling', 
    rating: 4.5, 
    reviews: [
      { user: 'Hermine', comment: 'Magisch!', likes: 10 },
      { user: 'Ron', comment: 'Spannend bis zum Schluss', likes: 7 }
    ] 
  }
]

export default function BooksPage() {
  return (
    <div>
      <h1>Alle Bücher</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={`/book/${book.id}`}>
              {book.title}
            </Link> von {book.author} – Bewertung: {book.rating}
          </li>
        ))}
      </ul>
    </div>
  )
}
