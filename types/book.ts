// TypeScript Interfaces für die BookReviewer App

export interface Review {
  user: string
  comment: string
  likes: number
  createdAt?: Date
}

export interface Book {
  id: number
  title: string
  author: string
  rating: number
  reviews: Review[]
  description?: string
  publishedYear?: number
  genre?: string[]
  isbn?: string
}

// API Response Types
export interface BooksResponse {
  books: Book[]
  total: number
}

export interface BookResponse {
  book: Book | null
}

// Error Types
export interface ApiError {
  message: string
  code: number
  details?: string
}
