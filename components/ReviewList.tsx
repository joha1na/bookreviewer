import { SerializedReview } from '@/types/book'

interface ReviewListProps {
  reviews: SerializedReview[]
}

interface ReviewItemProps {
  review: SerializedReview
}

function ReviewItem({ review }: ReviewItemProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ''
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return ''
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj)
    } catch {
      return ''
    }
  }

  return (
    <div className="review-item">
      <div className="review-header">
        <strong className="reviewer-name">{review.user}</strong>
        {review.createdAt && (
          <span className="review-date">{formatDate(review.createdAt)}</span>
        )}
      </div>
      
      <p className="review-comment">{review.comment}</p>
      
      <div className="review-likes">
        <span className="likes">👍 {review.likes}</span>
      </div>
    </div>
  )
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>Noch keine Rezensionen vorhanden.</p>
      </div>
    )
  }

  // Sortiere Reviews nach Likes (abstiegend)
  const sortedReviews = [...reviews].sort((a, b) => b.likes - a.likes)

  return (
    <div className="review-list">
      <h3>Rezensionen ({reviews.length})</h3>
      <div className="reviews">
        {sortedReviews.map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))}
      </div>
    </div>
  )
}
