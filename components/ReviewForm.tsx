'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
  bookId: string
}

export default function ReviewForm({ bookId }: ReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    user: '',
    comment: '',
    likes: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/books/${bookId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ user: '', comment: '', likes: 0 })
        router.refresh()
      } else {
        alert('Fehler beim Speichern der Rezension')
      }
    } catch (error) {
      alert('Fehler beim Speichern der Rezension')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Neue Rezension</h3>
      
      <input
        type="text"
        placeholder="Dein Name"
        value={formData.user}
        onChange={e => setFormData(prev => ({ ...prev, user: e.target.value }))}
        required
      />
      
      <textarea
        placeholder="Deine Rezension"
        value={formData.comment}
        onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
        required
      />
      
      <button type="submit" className="create-btn" disabled={loading}>
        {loading ? 'Speichert...' : 'Rezension hinzufügen'}
      </button>
    </form>
  )
}
