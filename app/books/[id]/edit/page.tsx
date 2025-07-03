import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Types } from 'mongoose'
import BookForm from '@/components/BookForm'
import connectToDatabase from '@/lib/mongodb'
import Book from '@/models/Book'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  if (!Types.ObjectId.isValid(id)) {
    notFound()
  }

  try {
    await connectToDatabase()
    const book = await Book.findById(id).lean().exec()
    
    if (!book) {
      notFound()
    }

    const serializedBook = {
      _id: book._id.toString(),
      title: book.title,
      author: book.author,
      rating: book.rating,
      description: book.description,
      publishedYear: book.publishedYear,
      genre: book.genre,
      isbn: book.isbn
    }

    return (
      <div>
        <div className="page-header">
          <Link href={`/book/${id}`} className="back-link">
            ← Zurück zum Buch
          </Link>
        </div>
        
        <BookForm book={serializedBook} mode="edit" />
      </div>
    )
  } catch (error) {
    console.error('Error fetching book:', error)
    notFound()
  }
}
