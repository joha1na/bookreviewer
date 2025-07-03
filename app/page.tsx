import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect zur Bücherliste (wie in next.config.js definiert)
  redirect('/books')
}
