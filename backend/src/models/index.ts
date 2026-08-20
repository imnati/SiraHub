/**
 * Central model export.
 * All 10 Mongoose models for the SiraHub platform.
 *
 * Import individual models from their own files when you need the Document type.
 * Import from here when you just need the model for queries.
 */

export { default as User } from './User';
export type { IUserDocument } from './User';

export { default as Company } from './Company';
export type { ICompanyDocument } from './Company';

export { default as Job } from './Job';
export type { IJobDocument } from './Job';

export { default as Application } from './Application';
export type { IApplicationDocument } from './Application';

export { default as Category } from './Category';
export type { ICategoryDocument } from './Category';

export { default as Skill } from './Skill';
export type { ISkillDocument } from './Skill';

export { default as Notification } from './Notification';
export type { INotificationDocument } from './Notification';

export { default as SavedJob } from './SavedJob';
export type { ISavedJobDocument } from './SavedJob';

export { default as Review } from './Review';
export type { IReviewDocument } from './Review';

export { default as Message } from './Message';
export type { IMessageDocument } from './Message';
