import { notFound } from 'next/navigation'

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

interface Props {
  params: {
    id: string
  }
}

export default function BookDetailPage({ params }: Props) {
  const id = parseInt(params.id, 10)
  const book = books.find(b => b.id === id)

  if (!book) {
    notFound()
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Autor: {book.author}</p>
      <p>Bewertung: {book.rating}</p>

      <h2>Rezensionen</h2>
      <ul>
        {book.reviews.map((review, index) => (
          <li key={index}>
            <strong>{review.user}:</strong> {review.comment} ({review.likes} Likes)
          </li>
        ))}
      </ul>
    </div>
  )
}
