'use client'

import { useRouter } from 'next/navigation'

export default function CreateBookButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/books/create' as any)
  }

  return (
    <button className="create-btn" onClick={handleClick}>
      ➕ Neues Buch
    </button>
  )
}
