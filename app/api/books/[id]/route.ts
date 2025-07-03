import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';
import { Types } from 'mongoose';

// GET /api/books/[id] - Einzelnes Buch abrufen
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
    
    // Buch suchen
    const book = await Book.findById(id).exec();
    
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
        book
      }
    });

  } catch (error: any) {
    console.error(`GET /api/books/[id] Error:`, error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Fehler beim Abrufen des Buchs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/books/[id] - Buch aktualisieren
export async function PUT(
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
    
    // Validation: Rating range wenn vorhanden
    if (body.rating !== undefined && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json({
        status: 'error',
        message: 'Bewertung muss zwischen 0 und 5 liegen',
        error: 'Rating must be between 0 and 5'
      }, { status: 400 });
    }
    
    // Update Data vorbereiten
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.author !== undefined) updateData.author = body.author.trim();
    if (body.rating !== undefined) updateData.rating = Number(body.rating);
    if (body.description !== undefined) updateData.description = body.description?.trim();
    if (body.publishedYear !== undefined) updateData.publishedYear = body.publishedYear ? Number(body.publishedYear) : undefined;
    if (body.genre !== undefined) updateData.genre = Array.isArray(body.genre) ? body.genre : [];
    if (body.isbn !== undefined) updateData.isbn = body.isbn?.trim();
    
    // Buch aktualisieren
    const updatedBook = await Book.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, // Gibt das aktualisierte Dokument zurück
        runValidators: true // Führt Mongoose-Validierung durch
      }
    ).exec();
    
    if (!updatedBook) {
      return NextResponse.json({
        status: 'error',
        message: 'Buch nicht gefunden',
        error: 'Book not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Buch erfolgreich aktualisiert',
      data: {
        book: updatedBook
      }
    });

  } catch (error: any) {
    console.error(`PUT /api/books/[id] Error:`, error);
    
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
      message: 'Fehler beim Aktualisieren des Buchs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/books/[id] - Buch löschen
export async function DELETE(
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
    
    // Buch löschen
    const deletedBook = await Book.findByIdAndDelete(id).exec();
    
    if (!deletedBook) {
      return NextResponse.json({
        status: 'error',
        message: 'Buch nicht gefunden',
        error: 'Book not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Buch erfolgreich gelöscht',
      data: {
        book: deletedBook
      }
    });

  } catch (error: any) {
    console.error(`DELETE /api/books/[id] Error:`, error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Fehler beim Löschen des Buchs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
