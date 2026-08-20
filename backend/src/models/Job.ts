import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from '../utils/slugify';
import { EmploymentType, ExperienceLevel, EducationLevel, JobStatus, SalaryPeriod } from '../types';

export interface IJobDocument extends Document {
  company: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: mongoose.Types.ObjectId;
  skills: mongoose.Types.ObjectId[];
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  location: {
    city: string;
    region?: string;
    country: string;
    isRemote: boolean;
  };
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: SalaryPeriod;
    isNegotiable: boolean;
    isHidden: boolean;
  };
  deadline: Date;
  status: JobStatus;
  isFeatured: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJobDocument>(
  {
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 10000 },
    requirements: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    skills: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
      validate: {
        validator: (arr: mongoose.Types.ObjectId[]) => arr.length <= 15,
        message: 'A job can have at most 15 skills',
      },
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance'] as EmploymentType[],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'] as ExperienceLevel[],
      required: true,
    },
    educationLevel: {
      type: String,
      enum: ['none', 'high-school', 'diploma', 'bachelors', 'masters', 'phd'] as EducationLevel[],
    },
    location: {
      city: { type: String, required: true, trim: true },
      region: { type: String, trim: true },
      country: { type: String, default: 'Ethiopia' },
      isRemote: { type: Boolean, default: false },
    },
    salary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'ETB' },
      period: {
        type: String,
        enum: ['hourly', 'daily', 'monthly', 'yearly'] as SalaryPeriod[],
        default: 'monthly',
      },
      isNegotiable: { type: Boolean, default: false },
      isHidden: { type: Boolean, default: false },
    },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'closed'] as JobStatus[],
      default: 'draft',
    },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
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
JobSchema.index({ company: 1 });
JobSchema.index({ postedBy: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ deadline: 1 });
JobSchema.index({ 'location.city': 1 });
JobSchema.index({ employmentType: 1 });
JobSchema.index({ experienceLevel: 1 });
JobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
JobSchema.index({ isFeatured: 1, status: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ skills: 1 });

// ─── Pre-save: auto-generate slug ─────────────────────────────────────────────
JobSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  const base = slugify(this.title);
  // Append a short random suffix to guarantee uniqueness without DB query overhead
  const suffix = Date.now().toString(36);
  this.slug = `${base}-${suffix}`;
  next();
});

const Job: Model<IJobDocument> = mongoose.model<IJobDocument>('Job', JobSchema);
export default Job;
