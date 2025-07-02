// TypeScript Interfaces für die BookReviewer App

export interface Review {
  user: string
  comment: string
  likes: number
  createdAt?: Date
}

export interface Book {
  _id: string // MongoDB ObjectId als string
  title: string
  author: string
  rating: number
  reviews: Review[]
  description?: string
  publishedYear?: number
  genre?: string[]
  isbn?: string
  reviewCount?: number // Virtual property
  averageReviewRating?: number // Virtual property
  createdAt?: Date
  updatedAt?: Date
}

// API Response Types
export interface BooksResponse {
  status: 'success' | 'error'
  data?: {
    books: Book[]
    pagination: {
      currentPage: number
      totalPages: number
      totalBooks: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
  message?: string
  error?: string | string[]
}

export interface BookResponse {
  status: 'success' | 'error'
  data?: {
    book: Book
  }
  message?: string
  error?: string | string[]
}

// Error Types
export interface ApiError {
  message: string
  code: number
  details?: string
}
