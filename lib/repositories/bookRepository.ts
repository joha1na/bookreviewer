// Book Repository für API-Calls
// Zentrale Stelle für alle Buch-bezogenen API-Operationen

import { Book, BooksResponse, BookResponse } from '@/types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface BookFilters {
  search?: string;
  author?: string;
  genre?: string;
  limit?: number;
  page?: number;
}

export interface CreateBookData {
  title: string;
  author: string;
  rating: number;
  description?: string;
  publishedYear?: number;
  genre?: string[];
  isbn?: string;
  reviews?: any[];
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  rating?: number;
  description?: string;
  publishedYear?: number;
  genre?: string[];
  isbn?: string;
}

export interface CreateReviewData {
  user: string;
  comment: string;
  likes?: number;
}

export interface ReviewsResponse {
  status: 'success' | 'error';
  data?: {
    bookId: string;
    bookTitle: string;
    bookAuthor: string;
    reviews: any[];
    reviewCount: number;
    averageRating?: number;
  };
  message?: string;
  error?: string | string[];
}

class BookRepository {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Network error' 
      }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Alle Bücher abrufen mit optionalen Filtern
   */
  async getBooks(filters: BookFilters = {}): Promise<BooksResponse> {
    const searchParams = new URLSearchParams();
    
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.author) searchParams.set('author', filters.author);
    if (filters.genre) searchParams.set('genre', filters.genre);
    if (filters.limit) searchParams.set('limit', filters.limit.toString());
    if (filters.page) searchParams.set('page', filters.page.toString());

    const url = `${API_BASE_URL}/api/books${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<BooksResponse>(response);
  }

  /**
   * Einzelnes Buch nach ID abrufen
   */
  async getBookById(id: string): Promise<BookResponse> {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<BookResponse>(response);
  }

  /**
   * Neues Buch erstellen
   */
  async createBook(bookData: CreateBookData): Promise<BookResponse> {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    return this.handleResponse<BookResponse>(response);
  }

  /**
   * Buch aktualisieren
   */
  async updateBook(id: string, updateData: UpdateBookData): Promise<BookResponse> {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    return this.handleResponse<BookResponse>(response);
  }

  /**
   * Buch löschen
   */
  async deleteBook(id: string): Promise<BookResponse> {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<BookResponse>(response);
  }

  /**
   * Alle Rezensionen eines Buchs abrufen
   */
  async getBookReviews(bookId: string): Promise<ReviewsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/reviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<ReviewsResponse>(response);
  }

  /**
   * Neue Rezension zu einem Buch hinzufügen
   */
  async addBookReview(bookId: string, reviewData: CreateReviewData): Promise<BookResponse> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    return this.handleResponse<BookResponse>(response);
  }

  /**
   * Textsuche in Büchern
   */
  async searchBooks(searchTerm: string, limit: number = 10): Promise<BooksResponse> {
    return this.getBooks({ search: searchTerm, limit });
  }

  /**
   * Bücher nach Autor suchen
   */
  async getBooksByAuthor(author: string): Promise<BooksResponse> {
    return this.getBooks({ author });
  }

  /**
   * Bücher nach Genre filtern
   */
  async getBooksByGenre(genre: string): Promise<BooksResponse> {
    return this.getBooks({ genre });
  }

  /**
   * Paginierte Bücherliste
   */
  async getBooksPage(page: number, limit: number = 10): Promise<BooksResponse> {
    return this.getBooks({ page, limit });
  }
}

// Singleton Instance exportieren
export const bookRepository = new BookRepository();
export default bookRepository;
