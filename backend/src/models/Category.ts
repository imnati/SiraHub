import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from '../utils/slugify';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  jobCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, maxlength: 500 },
    icon: { type: String },
    jobCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
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
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ jobCount: -1 });

// ─── Pre-save: auto-generate slug ─────────────────────────────────────────────
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>('Category', CategorySchema);
export default Category;
