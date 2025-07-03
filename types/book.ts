// TypeScript Interfaces für die BookReviewer App

export interface Review {
  _id?: string // MongoDB ObjectId als string
  user: string
  comment: string
  likes: number
  createdAt?: Date
}

// Serialized Review Type für JSON Transfer
export interface SerializedReview {
  _id?: string
  user: string
  comment: string
  likes: number
  createdAt?: string // ISO string
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

// Serialized Book Type für JSON Transfer
export interface SerializedBook {
  _id: string
  title: string
  author: string
  rating: number
  reviews: SerializedReview[]
  description?: string
  publishedYear?: number
  genre?: string[]
  isbn?: string
  reviewCount?: number
  averageReviewRating?: number
  createdAt?: string
  updatedAt?: string
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
