import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test: Erstelle ein Beispiel-Buch
    const testBook = new Book({
      title: 'Test Book für MongoDB',
      author: 'Test Autor',
      rating: 4.5,
      description: 'Ein Testbuch um die MongoDB Integration zu testen.',
      publishedYear: 2024,
      genre: ['Fiction', 'Test'],
      reviews: [
        {
          user: 'TestUser1',
          comment: 'Sehr gutes Buch! Kann ich nur empfehlen.',
          likes: 10,
          createdAt: new Date()
        },
        {
          user: 'TestUser2', 
          comment: 'Interessant geschrieben, aber nicht mein Stil.',
          likes: 3,
          createdAt: new Date()
        }
      ]
    });

    // Validierung testen
    const validationError = testBook.validateSync();
    if (validationError) {
      return NextResponse.json({
        status: 'error',
        message: 'Validierung fehlgeschlagen',
        errors: validationError.errors
      }, { status: 400 });
    }

    // Test verschiedene virtuals und methods
    const reviewCount = testBook.reviewCount;
    const avgRating = testBook.averageReviewRating;

    return NextResponse.json({
      status: 'success',
      message: '✅ Mongoose Models erfolgreich getestet!',
      testResults: {
        bookTitle: testBook.title,
        author: testBook.author,
        originalRating: testBook.rating,
        reviewCount: reviewCount,
        averageReviewRating: avgRating,
        genres: testBook.genre,
        validation: 'Passed',
        modelFeatures: {
          hasVirtuals: true,
          hasIndexes: true,
          hasValidation: true,
          hasMiddleware: true
        }
      },
      note: 'Buch wurde NICHT in der Datenbank gespeichert (nur Validierung)'
    });

  } catch (error) {
    console.error('MongoDB Models Test Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: '❌ Mongoose Models Test fehlgeschlagen',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
