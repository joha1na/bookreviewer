#!/usr/bin/env node

/**
 * Data Migration Script: Mock Data → MongoDB
 * 
 * Dieses Script migriert die bestehenden Mock-Daten aus lib/books-data.ts
 * in die MongoDB Datenbank.
 * 
 * Usage:
 *   npm run migrate-data
 * 
 * Oder direkt:
 *   npx tsx scripts/migrate-data.ts
 */

import { config } from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import Book from '../models/Book'

// Environment Variables laden
config({ path: path.join(process.cwd(), '.env') })

// MongoDB URI für lokale Ausführung (außerhalb Docker)
// Wir verwenden localhost statt mongodb (Docker-Container-Name)
const MONGODB_URI_LOCAL = 'mongodb://admin:password@localhost:27017/bookreviewer-dev?authSource=admin'

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI_LOCAL)
    console.log('✅ Connected to MongoDB (localhost)')
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    throw error
  }
}

// Mock-Daten direkt hier definieren um Type-Probleme zu vermeiden
const mockBooksData = [
  {
    title: 'Der kleine Prinz',
    author: 'Antoine de Saint-Exupéry',
    rating: 4.8,
    description: 'Ein zeitloser Klassiker über Freundschaft, Liebe und die wichtigen Dinge im Leben.',
    publishedYear: 1943,
    genre: ['Klassiker', 'Philosophie', 'Kinderbuch'],
    isbn: '978-3-15-018-024-9',
    reviews: [
      {
        user: 'Anna',
        comment: 'Wundervoll! Ein Buch, das man immer wieder lesen kann.',
        likes: 5,
        createdAt: new Date('2024-11-15')
      },
      {
        user: 'Tom',
        comment: 'Sehr tiefgründig und philosophisch. Hat mich zum Nachdenken gebracht.',
        likes: 2,
        createdAt: new Date('2024-11-20')
      },
      {
        user: 'Maria',
        comment: 'Perfekt für Jung und Alt. Die Illustrationen sind auch wunderschön.',
        likes: 8,
        createdAt: new Date('2024-12-01')
      }
    ]
  },
  {
    title: 'Harry Potter und der Stein der Weisen',
    author: 'J.K. Rowling',
    rating: 4.5,
    description: 'Der erste Band der berühmten Harry Potter-Serie. Ein Junge entdeckt, dass er ein Zauberer ist.',
    publishedYear: 1997,
    genre: ['Fantasy', 'Jugend', 'Abenteuer'],
    isbn: '978-3-551-55-167-2',
    reviews: [
      {
        user: 'Hermine',
        comment: 'Magisch! Hat meine Liebe zum Lesen geweckt.',
        likes: 10,
        createdAt: new Date('2024-10-05')
      },
      {
        user: 'Ron',
        comment: 'Brilliant! Quidditch ist das Beste!',
        likes: 7,
        createdAt: new Date('2024-10-12')
      }
    ]
  },
  {
    title: '1984',
    author: 'George Orwell',
    rating: 4.2,
    description: 'Ein dystopischer Roman über Überwachung und Kontrolle in einer totalitären Gesellschaft.',
    publishedYear: 1949,
    genre: ['Dystopie', 'Politische Fiktion', 'Klassiker'],
    isbn: '978-0-452-28423-4',
    reviews: [
      {
        user: 'Winston',
        comment: 'Erschreckend aktuell. Big Brother is watching you!',
        likes: 15,
        createdAt: new Date('2024-09-10')
      },
      {
        user: 'Julia',
        comment: 'Bedrückend aber wichtig zu lesen.',
        likes: 12,
        createdAt: new Date('2024-09-25')
      }
    ]
  },
  {
    title: 'Die Verwandlung',
    author: 'Franz Kafka',
    rating: 3.9,
    description: 'Die berühmte Erzählung über Gregor Samsa, der sich eines Morgens in ein Ungeziefer verwandelt findet.',
    publishedYear: 1915,
    genre: ['Klassiker', 'Literatur', 'Existentialismus'],
    isbn: '978-3-15-009-900-6',
    reviews: [
      {
        user: 'Gregor',
        comment: 'Verstörend und faszinierend zugleich.',
        likes: 6,
        createdAt: new Date('2024-08-18')
      }
    ]
  },
  {
    title: 'Sapiens: Eine kurze Geschichte der Menschheit',
    author: 'Yuval Noah Harari',
    rating: 4.6,
    description: 'Ein faszinierender Blick auf die Evolution der Menschheit von den Anfängen bis heute.',
    publishedYear: 2011,
    genre: ['Sachbuch', 'Geschichte', 'Anthropologie'],
    isbn: '978-3-421-04595-9',
    reviews: [
      {
        user: 'Historiker123',
        comment: 'Revolutionäre Perspektive auf die Menschheitsgeschichte!',
        likes: 20,
        createdAt: new Date('2024-07-22')
      },
      {
        user: 'Denkerin',
        comment: 'Zum Nachdenken anregend. Ändert den Blick auf unsere Spezies.',
        likes: 14,
        createdAt: new Date('2024-08-03')
      },
      {
        user: 'Student',
        comment: 'Pflichtlektüre für jeden! Sehr gut verständlich geschrieben.',
        likes: 9,
        createdAt: new Date('2024-08-15')
      }
    ]
  }
];

async function migrateData() {
  console.log('🚀 Starting data migration from Mock Data to MongoDB...')
  
  try {
    // MongoDB Verbindung herstellen
    await connectToMongoDB()
    console.log('✅ Connected to MongoDB')
    
    // Prüfen, ob bereits Bücher in der DB existieren
    const existingBooksCount = await Book.countDocuments()
    console.log(`📊 Current books in database: ${existingBooksCount}`)
    
    if (existingBooksCount > 0) {
      console.log('⚠️  Database already contains books.')
      console.log('   To avoid duplicates, this script will only add books that don\'t exist yet.')
      console.log('   Checking by ISBN and Title+Author combination...\n')
    }
    
    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0
    
    for (const mockBook of mockBooksData) {
      console.log(`📖 Processing: "${mockBook.title}" by ${mockBook.author}`)
      
      try {
        // Check if book already exists (by ISBN or Title+Author)
        const existingBook = await Book.findOne({
          $or: [
            { isbn: mockBook.isbn },
            { 
              title: mockBook.title, 
              author: mockBook.author 
            }
          ]
        })
        
        if (existingBook) {
          console.log(`   ⏭️  Skipped: Book already exists (${existingBook.isbn || 'no ISBN'})`)
          skippedCount++
          continue
        }
        
        // Create new book document
        const newBook = new Book({
          title: mockBook.title,
          author: mockBook.author,
          rating: mockBook.rating,
          description: mockBook.description,
          publishedYear: mockBook.publishedYear,
          genre: mockBook.genre || [],
          isbn: mockBook.isbn,
          reviews: mockBook.reviews.map(review => ({
            user: review.user,
            comment: review.comment,
            likes: review.likes,
            createdAt: review.createdAt
          }))
        })
        
        // Validate before saving
        const validationError = newBook.validateSync()
        if (validationError) {
          console.log(`   ❌ Validation Error:`, Object.values(validationError.errors).map(err => err.message))
          errorCount++
          continue
        }
        
        // Save to database
        await newBook.save()
        console.log(`   ✅ Migrated successfully (ID: ${newBook._id})`)
        migratedCount++
        
      } catch (error) {
        console.log(`   ❌ Error migrating book:`, error instanceof Error ? error.message : error)
        errorCount++
      }
    }
    
    console.log('\n🎉 Migration completed!')
    console.log(`📊 Results:`)
    console.log(`   ✅ Migrated: ${migratedCount} books`)
    console.log(`   ⏭️  Skipped: ${skippedCount} books (already exist)`)
    console.log(`   ❌ Errors: ${errorCount} books`)
    console.log(`   📖 Total in DB now: ${await Book.countDocuments()} books`)
    
    // Show some statistics
    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          totalReviews: { $sum: { $size: '$reviews' } },
          averageRating: { $avg: '$rating' },
          booksWithReviews: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$reviews' }, 0] }, 1, 0]
            }
          }
        }
      }
    ])
    
    if (stats.length > 0) {
      const stat = stats[0]
      console.log(`\n📈 Database Statistics:`)
      console.log(`   📚 Total Books: ${stat.totalBooks}`)
      console.log(`   💬 Total Reviews: ${stat.totalReviews}`)
      console.log(`   ⭐ Average Rating: ${stat.averageRating.toFixed(2)}`)
      console.log(`   📝 Books with Reviews: ${stat.booksWithReviews}/${stat.totalBooks}`)
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
  
  console.log('\n✨ Migration script finished successfully!')
  process.exit(0)
}

// Script ausführen
if (require.main === module) {
  migrateData()
}
