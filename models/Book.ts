import mongoose, { Schema, Document, Model } from 'mongoose';
import { ReviewSchema, IReview } from './Review';

// Book Interface für Mongoose (erweitert das TypeScript Interface)
export interface IBook extends Document {
  title: string;
  author: string;
  rating: number;
  reviews: IReview[];
  description?: string;
  publishedYear?: number;
  genre?: string[];
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual Properties
  averageReviewRating: number;
  reviewCount: number;
  
  // Instance Methods
  addReview(reviewData: Partial<IReview>): Promise<IBook>;
  removeReview(reviewId: string): Promise<IBook>;
}

// Book Schema Definition
const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Buchtitel ist erforderlich'],
    trim: true,
    minlength: [1, 'Titel muss mindestens 1 Zeichen lang sein'],
    maxlength: [200, 'Titel darf maximal 200 Zeichen lang sein'],
    index: true // Index für Suchfunktionen
  },
  author: {
    type: String,
    required: [true, 'Autor ist erforderlich'],
    trim: true,
    minlength: [2, 'Autorenname muss mindestens 2 Zeichen lang sein'],
    maxlength: [100, 'Autorenname darf maximal 100 Zeichen lang sein'],
    index: true // Index für Suchfunktionen
  },
  rating: {
    type: Number,
    required: [true, 'Bewertung ist erforderlich'],
    min: [0, 'Bewertung muss mindestens 0 sein'],
    max: [5, 'Bewertung darf maximal 5 sein'],
    validate: {
      validator: function(v: number) {
        return v >= 0 && v <= 5;
      },
      message: 'Bewertung muss zwischen 0 und 5 liegen'
    }
  },
  reviews: {
    type: [ReviewSchema],
    default: [],
    validate: {
      validator: function(v: IReview[]) {
        return v.length >= 0; // Mindestens 0 Reviews
      },
      message: 'Reviews Array muss gültig sein'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Beschreibung darf maximal 2000 Zeichen lang sein']
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Veröffentlichungsjahr muss nach 1000 liegen'],
    max: [new Date().getFullYear() + 1, 'Veröffentlichungsjahr kann nicht in der Zukunft liegen'],
    validate: {
      validator: function(v: number) {
        return !v || (v >= 1000 && v <= new Date().getFullYear() + 1);
      },
      message: 'Ungültiges Veröffentlichungsjahr'
    }
  },
  genre: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.every(genre => genre.length > 0 && genre.length <= 50);
      },
      message: 'Jedes Genre muss zwischen 1 und 50 Zeichen lang sein'
    }
  },
  isbn: {
    type: String,
    trim: true,
    unique: true, // ISBN muss eindeutig sein
    sparse: true, // Erlaubt null/undefined Werte, aber eindeutige nicht-null Werte
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        // Basis ISBN Validation (10 oder 13 Zeichen)
        const isbn = v.replace(/[-\s]/g, '');
        return isbn.length === 10 || isbn.length === 13;
      },
      message: 'ISBN muss 10 oder 13 Zeichen lang sein (ohne Bindestriche)'
    }
  }
}, {
  timestamps: true, // Automatisch createdAt und updatedAt
  collection: 'books' // Expliziter Collection-Name
});

// Compound Indexes für bessere Performance
BookSchema.index({ title: 1, author: 1 }); // Suche nach Titel + Autor
BookSchema.index({ author: 1, publishedYear: -1 }); // Suche nach Autor + Jahr
BookSchema.index({ genre: 1, rating: -1 }); // Suche nach Genre + Bewertung
BookSchema.index({ rating: -1, createdAt: -1 }); // Sortierung nach Bewertung + Datum

// Text Index für Volltext-Suche
BookSchema.index({ 
  title: 'text', 
  author: 'text', 
  description: 'text' 
}, {
  weights: {
    title: 10,    // Titel hat höchste Gewichtung
    author: 5,    // Autor hat mittlere Gewichtung
    description: 1 // Beschreibung hat niedrigste Gewichtung
  },
  name: 'book_text_index'
});

// Virtual für durchschnittliche Bewertung basierend auf Reviews
BookSchema.virtual('averageReviewRating').get(function() {
  if (this.reviews.length === 0) return this.rating;
  
  const sum = this.reviews.reduce((acc, review) => acc + (review.likes || 0), 0);
  return this.reviews.length > 0 ? sum / this.reviews.length : this.rating;
});

// Virtual für Anzahl der Reviews
BookSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

// Middleware: Aktualisiere die Hauptbewertung basierend auf Reviews
BookSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    // Aktualisiere Rating basierend auf durchschnittlichen Likes der Reviews
    const totalLikes = this.reviews.reduce((sum, review) => sum + (review.likes || 0), 0);
    const avgLikes = totalLikes / this.reviews.length;
    
    // Konvertiere Likes zu Rating (0-5 Skala)
    // Annahme: 0-10 Likes = 0-5 Rating
    this.rating = Math.min(5, Math.max(0, Math.round(avgLikes / 2)));
  }
  next();
});

// Instance Methods
BookSchema.methods.addReview = function(reviewData: Partial<IReview>) {
  this.reviews.push({
    user: reviewData.user,
    comment: reviewData.comment,
    likes: reviewData.likes || 0,
    createdAt: reviewData.createdAt || new Date()
  });
  return this.save();
};

BookSchema.methods.removeReview = function(reviewId: string) {
  this.reviews = this.reviews.filter((review: IReview & { _id?: any }) => review._id?.toString() !== reviewId);
  return this.save();
};

// Static Methods
BookSchema.statics.findByAuthor = function(author: string) {
  return this.find({ author: new RegExp(author, 'i') });
};

BookSchema.statics.findByGenre = function(genre: string) {
  return this.find({ genre: { $in: [genre] } });
};

BookSchema.statics.findByRatingRange = function(minRating: number, maxRating: number) {
  return this.find({ 
    rating: { 
      $gte: minRating, 
      $lte: maxRating 
    } 
  });
};

// Stelle sicher, dass virtuals in JSON serialisiert werden
BookSchema.set('toJSON', { virtuals: true });
BookSchema.set('toObject', { virtuals: true });

// Model Interface erweitern
interface IBookModel extends Model<IBook> {
  findByAuthor(author: string): Promise<IBook[]>;
  findByGenre(genre: string): Promise<IBook[]>;
  findByRatingRange(minRating: number, maxRating: number): Promise<IBook[]>;
}

// Export des Models
const Book = (mongoose.models.Book as IBookModel) || mongoose.model<IBook, IBookModel>('Book', BookSchema);

export default Book;
export type { IBookModel };
