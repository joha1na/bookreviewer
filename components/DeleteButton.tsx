'use client'

import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  bookId: string
  bookTitle: string
}

export default function DeleteButton({ bookId, bookTitle }: DeleteButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Möchten Sie "${bookTitle}" wirklich löschen?`)) return

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/books')
        router.refresh()
      } else {
        alert('Fehler beim Löschen')
      }
    } catch (error) {
      alert('Fehler beim Löschen')
    }
  }

  return (
    <button onClick={handleDelete} className="delete-btn">
      🗑️ Löschen
    </button>
  )
}
