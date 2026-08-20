import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from '../utils/slugify';

export interface ISkillDocument extends Document {
  name: string;
  slug: string;
  category?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
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
SkillSchema.index({ name: 'text' });
SkillSchema.index({ category: 1 });
SkillSchema.index({ isActive: 1 });

// ─── Pre-save: auto-generate slug ─────────────────────────────────────────────
SkillSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

const Skill: Model<ISkillDocument> = mongoose.model<ISkillDocument>('Skill', SkillSchema);
export default Skill;
