import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReviewDocument extends Document {
  company: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  pros?: string;
  cons?: string;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 2000 },
    pros: { type: String, maxlength: 1000 },
    cons: { type: String, maxlength: 1000 },
    isAnonymous: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
ReviewSchema.index({ company: 1, author: 1 }, { unique: true });
ReviewSchema.index({ company: 1, createdAt: -1 });
ReviewSchema.index({ author: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ isApproved: 1 });

const Review: Model<IReviewDocument> = mongoose.model<IReviewDocument>('Review', ReviewSchema);
export default Review;
