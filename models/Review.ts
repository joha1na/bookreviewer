import mongoose, { Schema, Document } from 'mongoose';

// Review Interface für Mongoose
export interface IReview {
  _id?: mongoose.Types.ObjectId;
  user: string;
  comment: string;
  likes: number;
  createdAt: Date;
}

// Review Schema (wird als Subdocument in Book verwendet)
export const ReviewSchema = new Schema<IReview>({
  user: {
    type: String,
    required: [true, 'Username ist erforderlich'],
    trim: true,
    minlength: [2, 'Username muss mindestens 2 Zeichen lang sein'],
    maxlength: [50, 'Username darf maximal 50 Zeichen lang sein']
  },
  comment: {
    type: String,
    required: [true, 'Kommentar ist erforderlich'],
    trim: true,
    minlength: [10, 'Kommentar muss mindestens 10 Zeichen lang sein'],
    maxlength: [1000, 'Kommentar darf maximal 1000 Zeichen lang sein']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes können nicht negativ sein']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Wir verwenden createdAt manuell
  _id: true // Jede Review bekommt eine eigene _id
});

// Index für bessere Performance bei Suchen
ReviewSchema.index({ user: 1, createdAt: -1 });
