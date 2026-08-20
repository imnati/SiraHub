import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedJobDocument extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SavedJobSchema = new Schema<ISavedJobDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
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
SavedJobSchema.index({ user: 1, job: 1 }, { unique: true });
SavedJobSchema.index({ user: 1, createdAt: -1 });
SavedJobSchema.index({ job: 1 });

const SavedJob: Model<ISavedJobDocument> = mongoose.model<ISavedJobDocument>('SavedJob', SavedJobSchema);
export default SavedJob;
