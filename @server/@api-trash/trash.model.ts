// import { CollabocateInstanceDocument } from '@collabocate/instance.model';
import { UserDocument } from '@user/user.model';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const dotEnv = dotenv.config();
dotenvExpand.expand(dotEnv);

export const EXPIRATION_IN_SEC = Number(process.env.TRASH_LIFETIME_IN_DAYS)*24*60*60 || 7*24*60*60; // defaults to 7 days (in sec)

export interface TrashDocument extends mongoose.Document {
  _id?: string;
  collectionName: string;
  trashedDocument: any;
  trashedAt: Date;
  toBeDeletedAt: Date;
  trashLifetime?: number;
  user: UserDocument;
}

const collectionName = 'trash';

const TrashSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  trashedDocument: { type: mongoose.Schema.Types.Mixed, required: true }, // Store any document structure
  trashedAt: { type: Date, default: Date.now}, 
  toBeDeletedAt: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref:"user", required: true }
});

// Auto-calculate the expiration time before saving
TrashSchema.pre('save', function (next) {
  this.toBeDeletedAt= new Date(this.trashedAt.getTime() + EXPIRATION_IN_SEC * 1000);
  next();
});

// Ensure automatic deletion after expiration
TrashSchema.index({ toBeDeletedAt: 1 }, { expireAfterSeconds: 0 });

const TrashModel = mongoose.model<TrashDocument>(collectionName, TrashSchema, collectionName); //declare collection name a second time to prevent mongoose from pluralizing or adding 's' to the collection name

export { TrashModel };