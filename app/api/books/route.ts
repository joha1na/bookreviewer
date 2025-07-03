import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';
import { IBook } from '@/models';

// GET /api/books - Alle Bücher abrufen
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Query Parameter für Suche und Filterung
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const author = searchParams.get('author');
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Query-Objekt aufbauen
    let query: any = {};
    
    // Textsuche (title, author, description)
    if (search) {
      query.$text = { $search: search };
    }
    
    // Autor-Filter
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    
    // Genre-Filter  
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    // Pagination berechnen
    const skip = (page - 1) * limit;
    
    // Bücher abrufen mit Pagination
    const books = await Book.find(query)
      .sort({ createdAt: -1 }) // Neueste zuerst
      .skip(skip)
      .limit(limit)
      .exec();
    
    // Gesamtanzahl für Pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error: any) {
    console.error('GET /api/books Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Fehler beim Abrufen der Bücher',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/books - Neues Buch erstellen
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validation: Required fields
    if (!body.title || !body.author || body.rating === undefined) {
      return NextResponse.json({
        status: 'error',
        message: 'Titel, Autor und Bewertung sind erforderlich',
        error: 'Missing required fields: title, author, rating'
      }, { status: 400 });
    }
    
    // Validation: Rating range
    if (body.rating < 0 || body.rating > 5) {
      return NextResponse.json({
        status: 'error',
        message: 'Bewertung muss zwischen 0 und 5 liegen',
        error: 'Rating must be between 0 and 5'
      }, { status: 400 });
    }
    
    // Neues Buch erstellen
    const newBook = new Book({
      title: body.title.trim(),
      author: body.author.trim(),
      rating: Number(body.rating),
      description: body.description?.trim(),
      publishedYear: body.publishedYear ? Number(body.publishedYear) : undefined,
      genre: Array.isArray(body.genre) ? body.genre : [],
      isbn: body.isbn?.trim(),
      reviews: body.reviews || []
    });
    
    // Validation durch Mongoose
    const validationError = newBook.validateSync();
    if (validationError) {
      return NextResponse.json({
        status: 'error',
        message: 'Validierungsfehler',
        error: Object.values(validationError.errors).map(err => err.message)
      }, { status: 400 });
    }
    
    // Buch speichern
    const savedBook = await newBook.save();
    
    return NextResponse.json({
      status: 'success',
      message: 'Buch erfolgreich erstellt',
      data: {
        book: savedBook
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/books Error:', error);
    
    // Mongoose Validation Error
    if (error?.name === 'ValidationError') {
      return NextResponse.json({
        status: 'error',
        message: 'Validierungsfehler',
        error: Object.values(error.errors).map((err: any) => err.message)
      }, { status: 400 });
    }
    
    // MongoDB Duplicate Key Error (z.B. ISBN)
    if (error?.code === 11000) {
      return NextResponse.json({
        status: 'error',
        message: 'Ein Buch mit dieser ISBN existiert bereits',
        error: 'Duplicate ISBN'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Fehler beim Erstellen des Buchs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
