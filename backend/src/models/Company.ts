import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from '../utils/slugify';
import { CompanySize } from '../types';

// ─── Document interface ───────────────────────────────────────────────────────
export interface ICompanyDocument extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  logoPublicId?: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  industry: string;
  size: CompanySize;
  founded?: number;
  location: {
    city: string;
    region?: string;
    country: string;
    address?: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompanyDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    logo: { type: String },
    logoPublicId: { type: String },
    description: { type: String, required: true, maxlength: 2000 },
    website: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    industry: { type: String, required: true, trim: true },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] as CompanySize[],
    },
    founded: { type: Number, min: 1800, max: new Date().getFullYear() },
    location: {
      city: { type: String, required: true, trim: true },
      region: { type: String, trim: true },
      country: { type: String, default: 'Ethiopia' },
      address: { type: String, trim: true },
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
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
// Note: slug has unique:true in the field definition, so no separate index needed.
CompanySchema.index({ owner: 1 }, { unique: true }); // one company per employer
CompanySchema.index({ name: 'text', description: 'text' });
CompanySchema.index({ isVerified: 1, isActive: 1 });
CompanySchema.index({ industry: 1 });
CompanySchema.index({ 'location.city': 1 });

// ─── Pre-save: auto-generate slug from name ───────────────────────────────────
CompanySchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  const base = slugify(this.name);
  let candidate = base;
  let counter = 1;
  // Ensure uniqueness
  while (await mongoose.model('Company').exists({ slug: candidate, _id: { $ne: this._id } })) {
    candidate = `${base}-${counter++}`;
  }
  this.slug = candidate;
  next();
});

const Company: Model<ICompanyDocument> = mongoose.model<ICompanyDocument>('Company', CompanySchema);
export default Company;
