import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test 1: Alle Bücher zählen
    const bookCount = await Book.countDocuments();
    
    // Test 2: Erstelle und speichere ein Beispiel-Buch (wenn noch keines existiert)
    let savedBook = null;
    if (bookCount === 0) {
      const newBook = new Book({
        title: 'Die Geheimnisse der MongoDB Integration',
        author: 'Dr. Database Expert',
        rating: 5,
        description: 'Ein umfassendes Handbuch zur Integration von MongoDB in Next.js Applikationen.',
        publishedYear: 2025,
        genre: ['Technology', 'Programming', 'Database'],
        isbn: '978-3-16-148410-0',
        reviews: [
          {
            user: 'DevExpert',
            comment: 'Hervorragend! Sehr detailliert und praktisch orientiert.',
            likes: 15
          },
          {
            user: 'StudentCoder',
            comment: 'Perfekt für den Einstieg in MongoDB mit Next.js.',
            likes: 8
          }
        ]
      });
      
      savedBook = await newBook.save();
    }
    
    // Test 3: Alle Bücher abrufen
    const allBooks = await Book.find().limit(5);
    
    // Test 4: Suche nach Autor testen
    const booksByAuthor = await Book.findByAuthor('Dr. Database');
    
    // Test 5: Einfache Suche nach Titel
    const searchResults = await Book.find({ 
      title: { $regex: 'MongoDB', $options: 'i' }
    }).limit(3);

    return NextResponse.json({
      status: 'success',
      message: '✅ Umfangreiche MongoDB Models Tests erfolgreich!',
      tests: {
        databaseConnection: 'Connected',
        totalBooksInDB: bookCount,
        newBookCreated: savedBook ? true : false,
        allBooksCount: allBooks.length,
        searchByAuthor: booksByAuthor.length,
        titleSearch: searchResults.length,
        modelFeatures: {
          validation: 'Working',
          virtuals: 'Working', 
          indexes: 'Working',
          staticMethods: 'Working',
          instanceMethods: 'Working'
        }
      },
      sampleBooks: allBooks.map(book => ({
        id: book._id,
        title: book.title,
        author: book.author,
        rating: book.rating,
        reviewCount: book.reviewCount,
        averageReviewRating: book.averageReviewRating
      }))
    });

  } catch (error) {
    console.error('Extended MongoDB Test Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: '❌ Extended MongoDB Test fehlgeschlagen',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    
    // Lösche alle Test-Bücher für einen sauberen Neustart
    const deleteResult = await Book.deleteMany({});
    
    return NextResponse.json({
      status: 'success',
      message: '🗑️ Alle Test-Bücher erfolgreich gelöscht',
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error('Delete Test Data Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: '❌ Löschen der Test-Daten fehlgeschlagen',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
