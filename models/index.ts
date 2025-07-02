// Central Models Export
// Vereinfacht Imports: import { Book, IBook, IReview } from '@/models'

export { default as Book } from './Book';
export type { IBook, IBookModel } from './Book';
export { ReviewSchema } from './Review';
export type { IReview } from './Review';

// Re-export für Kompatibilität mit bestehenden TypeScript Interfaces
export type {
  Book as BookType,
  Review as ReviewType,
  BooksResponse,
  BookResponse,
  ApiError
} from '@/types/book';
