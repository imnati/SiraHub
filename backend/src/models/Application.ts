import mongoose, { Schema, Document, Model } from 'mongoose';
import { ApplicationStatus, InterviewFormat, IStatusHistoryEntry, IInterview, IAttachment } from '../types';

export interface IApplicationDocument extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  cvUrl: string;
  coverLetter?: string;
  portfolioUrl?: string;
  additionalDocs: IAttachment[];
  status: ApplicationStatus;
  statusHistory: IStatusHistoryEntry[];
  interview?: IInterview;
  isWithdrawn: boolean;
  withdrawnAt?: Date;
  employerNote?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    publicId: { type: String },
    mimeType: { type: String },
    size: { type: Number },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'] as ApplicationStatus[],
      required: true,
    },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, maxlength: 500 },
  },
  { _id: false }
);

const InterviewSchema = new Schema<IInterview>(
  {
    scheduledAt: { type: Date },
    format: {
      type: String,
      enum: ['in-person', 'video', 'phone'] as InterviewFormat[],
    },
    location: { type: String, trim: true },
    meetingUrl: { type: String, trim: true },
    notes: { type: String, maxlength: 1000 },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    cvUrl: { type: String, required: true },
    coverLetter: { type: String, maxlength: 3000 },
    portfolioUrl: { type: String, trim: true },
    additionalDocs: { type: [AttachmentSchema], default: [] },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'] as ApplicationStatus[],
      default: 'applied',
    },
    statusHistory: { type: [StatusHistorySchema], default: [] },
    interview: { type: InterviewSchema },
    isWithdrawn: { type: Boolean, default: false },
    withdrawnAt: { type: Date },
    employerNote: { type: String, maxlength: 1000 },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // employerNote should not be visible to applicants — filtered at controller level
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
ApplicationSchema.index({ applicant: 1 });
ApplicationSchema.index({ job: 1 });
ApplicationSchema.index({ company: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ isWithdrawn: 1 });

const Application: Model<IApplicationDocument> = mongoose.model<IApplicationDocument>('Application', ApplicationSchema);
export default Application;
