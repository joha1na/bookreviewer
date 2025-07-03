import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';
import { Types } from 'mongoose';

// GET /api/books/[id]/reviews - Alle Rezensionen eines Buchs abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Validierung: ObjectId Format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        status: 'error',
        message: 'Ungültige Buch-ID',
        error: 'Invalid ObjectId format'
      }, { status: 400 });
    }
    
    // Buch mit Rezensionen suchen
    const book = await Book.findById(id).select('title author reviews reviewCount averageReviewRating').exec();
    
    if (!book) {
      return NextResponse.json({
        status: 'error',
        message: 'Buch nicht gefunden',
        error: 'Book not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'success',
      data: {
        bookId: book._id,
        bookTitle: book.title,
        bookAuthor: book.author,
        reviews: book.reviews,
        reviewCount: book.reviewCount,
        averageRating: book.averageReviewRating
      }
    });

  } catch (error: any) {
    console.error(`GET /api/books/[id]/reviews Error:`, error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Fehler beim Abrufen der Rezensionen',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/books/[id]/reviews - Neue Rezension hinzufügen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    // Validierung: ObjectId Format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        status: 'error',
        message: 'Ungültige Buch-ID',
        error: 'Invalid ObjectId format'
      }, { status: 400 });
    }
    
    // Validation: Required fields
    if (!body.user || !body.comment) {
      return NextResponse.json({
        status: 'error',
        message: 'Benutzername und Kommentar sind erforderlich',
        error: 'Missing required fields: user, comment'
      }, { status: 400 });
    }
    
    // Validation: Likes (falls vorhanden)
    if (body.likes !== undefined && (typeof body.likes !== 'number' || body.likes < 0)) {
      return NextResponse.json({
        status: 'error',
        message: 'Likes müssen eine positive Zahl sein',
        error: 'Likes must be a positive number'
      }, { status: 400 });
    }
    
    // Buch suchen
    const book = await Book.findById(id);
    
    if (!book) {
      return NextResponse.json({
        status: 'error',
        message: 'Buch nicht gefunden',
        error: 'Book not found'
      }, { status: 404 });
    }
    
    // Neue Rezension erstellen
    const newReview = {
      user: body.user.trim(),
      comment: body.comment.trim(),
      likes: body.likes || 0,
      createdAt: new Date()
    };
    
    // Rezension mit Mongoose Instance Method hinzufügen
    await book.addReview(newReview);
    
    return NextResponse.json({
      status: 'success',
      message: 'Rezension erfolgreich hinzugefügt',
      data: {
        book: book,
        newReview: newReview
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error(`POST /api/books/[id]/reviews Error:`, error);
    
    // Mongoose Validation Error
    if (error?.name === 'ValidationError') {
      return NextResponse.json({
        status: 'error',
        message: 'Validierungsfehler',
        error: Object.values(error.errors).map((err: any) => err.message)
      }, { status: 400 });
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Fehler beim Hinzufügen der Rezension',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
