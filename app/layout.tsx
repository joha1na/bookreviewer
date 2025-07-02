import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Book Reviewer',
  description: 'Eine moderne Buchbewertungs-App mit Next.js',
  keywords: ['Bücher', 'Rezensionen', 'Bewertungen'],
  authors: [{ name: 'BookReviewer Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <Navigation />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
