import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAttachment } from '../types';

export interface IMessageDocument extends Document {
  conversationId: string;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  jobContext?: mongoose.Types.ObjectId;
  applicationContext?: mongoose.Types.ObjectId;
  body?: string;
  attachments: IAttachment[];
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
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

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: String, required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobContext: { type: Schema.Types.ObjectId, ref: 'Job' },
    applicationContext: { type: Schema.Types.ObjectId, ref: 'Application' },
    body: { type: String, maxlength: 2000 },
    attachments: { type: [AttachmentSchema], default: [] },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
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
MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ recipient: 1, isRead: 1 });
MessageSchema.index({ jobContext: 1 });

// ─── Static helper: generate deterministic conversationId ────────────────────
MessageSchema.statics.buildConversationId = function (
  userId1: string,
  userId2: string
): string {
  return [userId1, userId2].sort().join('_');
};

const Message: Model<IMessageDocument> = mongoose.model<IMessageDocument>('Message', MessageSchema);
export default Message;
