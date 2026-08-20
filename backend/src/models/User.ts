import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserRole,
  LanguageProficiency,
  IExperienceEntry,
  IEducationEntry,
  ILanguageEntry,
  ICertificateEntry,
  ISocialLinks,
  IJobSeekerProfile,
} from '../types';

// ─── Document interface ───────────────────────────────────────────────────────
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  emailVerifyToken?: string;
  emailVerifyExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  refreshTokenHash?: string;
  jobSeekerProfile: IJobSeekerProfile;
  createdAt: Date;
  updatedAt: Date;
  /** Instance method: compare plain-text password with stored hash */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────
const ExperienceSchema = new Schema<IExperienceEntry>(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, maxlength: 1000 },
  },
  { _id: true }
);

const EducationSchema = new Schema<IEducationEntry>(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    grade: { type: String, trim: true },
    description: { type: String },
  },
  { _id: true }
);

const LanguageSchema = new Schema<ILanguageEntry>(
  {
    language: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: ['beginner', 'conversational', 'professional', 'native'] as LanguageProficiency[],
      required: true,
    },
  },
  { _id: false }
);

const CertificateSchema = new Schema<ICertificateEntry>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    fileUrl: { type: String },
    publicId: { type: String },
  },
  { _id: true }
);

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false }
);

const JobSeekerProfileSchema = new Schema<IJobSeekerProfile>(
  {
    headline: { type: String, trim: true, maxlength: 200 },
    cvUrl: { type: String },
    cvPublicId: { type: String },
    portfolioUrl: { type: String, trim: true },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    languages: { type: [LanguageSchema], default: [] },
    certificates: { type: [CertificateSchema], default: [] },
    socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  },
  { _id: false }
);

// ─── Main User schema ─────────────────────────────────────────────────────────
const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer', 'admin'] as UserRole[],
      default: 'jobseeker',
    },
    avatar: { type: String },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpiry: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
    jobSeekerProfile: { type: JobSeekerProfileSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // Remove internal-only fields from JSON output
        delete ret.password;
        delete ret.emailVerifyToken;
        delete ret.emailVerifyExpiry;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpiry;
        delete ret.refreshTokenHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ 'jobSeekerProfile.skills': 1 });
// email is indexed via unique:true in the field definition

// ─── Pre-save: hash password only when modified ───────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);
export default User;
