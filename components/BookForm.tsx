'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookFormProps {
  book?: {
    _id?: string
    title: string
    author: string
    rating: number
    description?: string
    publishedYear?: number
    genre?: string[]
    isbn?: string
  }
  mode: 'create' | 'edit'
}

export default function BookForm({ book, mode }: BookFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    rating: book?.rating?.toString() || '',
    description: book?.description || '',
    publishedYear: book?.publishedYear || new Date().getFullYear(),
    genre: book?.genre?.join(', ') || '',
    isbn: book?.isbn || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/books' : `/api/books/${book?._id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const payload = {
        ...formData,
        rating: parseFloat(formData.rating as string) || 0,
        genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
        isbn: formData.isbn.trim() || undefined // Leere ISBN nicht senden
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        router.push('/books' as any)
        router.refresh()
      } else {
        const errorData = await response.text()
        console.error('Error response:', errorData)
        alert(`Fehler beim Speichern: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      console.error('Network error:', error)
      alert(`Fehler beim Speichern: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{mode === 'create' ? 'Neues Buch' : 'Buch bearbeiten'}</h2>
      
      <input
        type="text"
        placeholder="Titel"
        value={formData.title}
        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
      />
      
      <input
        type="text"
        placeholder="Autor"
        value={formData.author}
        onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
        required
      />
      
      <div className="rating-input-container">
        <input
          type="number"
          placeholder="Bewertung (0-5)"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={e => setFormData(prev => ({ ...prev, rating: e.target.value }))}
          required
        />
        {formData.rating && (
          <span className="rating-preview">
            {'⭐'.repeat(Math.floor(parseFloat(formData.rating)))} {formData.rating}
          </span>
        )}
      </div>
      
      <textarea
        placeholder="Beschreibung"
        value={formData.description}
        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
      />
      
      <input
        type="number"
        placeholder="Erscheinungsjahr"
        value={formData.publishedYear}
        onChange={e => setFormData(prev => ({ ...prev, publishedYear: parseInt(e.target.value) }))}
      />
      
      <input
        type="text"
        placeholder="Genres (kommagetrennt)"
        value={formData.genre}
        onChange={e => setFormData(prev => ({ ...prev, genre: e.target.value }))}
      />
      
      <input
        type="text"
        placeholder="ISBN"
        value={formData.isbn}
        onChange={e => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
      />
      
      <div className="form-actions">
        <button type="button" className="delete-btn" onClick={() => router.back()}>
          Abbrechen
        </button>
        <button type="submit" className="create-btn" disabled={loading}>
          {loading ? 'Speichert...' : 'Speichern'}
        </button>
      </div>
    </form>
  )
}
