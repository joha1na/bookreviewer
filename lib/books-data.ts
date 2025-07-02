import { Book } from '@/types/book'

// Mock-Daten für die BookReviewer App
// In einer echten App würden diese aus einer Datenbank kommen

export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Der kleine Prinz',
    author: 'Antoine de Saint-Exupéry',
    rating: 4.8,
    description: 'Ein zeitloser Klassiker über Freundschaft, Liebe und die wichtigen Dinge im Leben.',
    publishedYear: 1943,
    genre: ['Klassiker', 'Philosophie', 'Kinderbuch'],
    isbn: '978-3-15-018-024-9',
    reviews: [
      {
        user: 'Anna',
        comment: 'Wundervoll! Ein Buch, das man immer wieder lesen kann.',
        likes: 5,
        createdAt: new Date('2024-11-15')
      },
      {
        user: 'Tom',
        comment: 'Sehr tiefgründig und philosophisch. Hat mich zum Nachdenken gebracht.',
        likes: 2,
        createdAt: new Date('2024-11-20')
      },
      {
        user: 'Maria',
        comment: 'Perfekt für Jung und Alt. Die Illustrationen sind auch wunderschön.',
        likes: 8,
        createdAt: new Date('2024-12-01')
      }
    ]
  },
  {
    id: 2,
    title: 'Harry Potter und der Stein der Weisen',
    author: 'J.K. Rowling',
    rating: 4.5,
    description: 'Der erste Band der berühmten Harry Potter-Serie. Ein Junge entdeckt, dass er ein Zauberer ist.',
    publishedYear: 1997,
    genre: ['Fantasy', 'Jugend', 'Abenteuer'],
    isbn: '978-3-551-55-167-2',
    reviews: [
      {
        user: 'Hermine',
        comment: 'Magisch! Hat meine Liebe zum Lesen geweckt.',
        likes: 10,
        createdAt: new Date('2024-10-12')
      },
      {
        user: 'Ron',
        comment: 'Spannend bis zum Schluss. Konnte es nicht weglegen!',
        likes: 7,
        createdAt: new Date('2024-10-15')
      },
      {
        user: 'Neville',
        comment: 'Hat mir Mut gemacht, auch wenn man sich schwach fühlt.',
        likes: 4,
        createdAt: new Date('2024-11-02')
      }
    ]
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    rating: 4.6,
    description: 'Ein dystopischer Roman über Überwachung, Kontrolle und den Verlust der Freiheit.',
    publishedYear: 1949,
    genre: ['Dystopie', 'Klassiker', 'Politik'],
    isbn: '978-3-499-25-672-9',
    reviews: [
      {
        user: 'Winston',
        comment: 'Erschreckend aktuell. Ein Mahnmal für die Demokratie.',
        likes: 15,
        createdAt: new Date('2024-09-20')
      },
      {
        user: 'Julia',
        comment: 'Schwer zu lesen, aber wichtig zu verstehen.',
        likes: 6,
        createdAt: new Date('2024-10-05')
      }
    ]
  }
]

// Utility Funktionen für Datenmanipulation
export function getAllBooks(): Book[] {
  return mockBooks
}

export function getBookById(id: number): Book | undefined {
  return mockBooks.find(book => book.id === id)
}

export function searchBooks(query: string): Book[] {
  const lowercaseQuery = query.toLowerCase()
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.genre?.some(g => g.toLowerCase().includes(lowercaseQuery))
  )
}

export function getBooksByGenre(genre: string): Book[] {
  return mockBooks.filter(book => 
    book.genre?.some(g => g.toLowerCase() === genre.toLowerCase())
  )
}

// Statistiken
export function getBookStats() {
  const totalBooks = mockBooks.length
  const totalReviews = mockBooks.reduce((sum, book) => sum + book.reviews.length, 0)
  const averageRating = mockBooks.reduce((sum, book) => sum + book.rating, 0) / totalBooks
  
  return {
    totalBooks,
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10
  }
}
