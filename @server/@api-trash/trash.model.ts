// import { CollabocateInstanceDocument } from '@collabocate/instance.model';
import { UserDocument } from '@user/user.model';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const dotEnv = dotenv.config();
dotenvExpand.expand(dotEnv);

export interface TrashDocument extends mongoose.Document {
  _id?: string;
  collectionName: string;
  deletedDocument: any;
  deletedAt: Date;
  user: UserDocument;
}

const collectionName = 'trash';

const TrashSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  deletedDocument: { type: mongoose.Schema.Types.Mixed, required: true }, // Store any document structure
  deletedAt: { type: Date, default: Date.now, expires: process.env.TRASH_LIFETIME as string }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref:"user", required: true }
});


const TrashModel = mongoose.model<TrashDocument>(collectionName, TrashSchema, collectionName); //declare collection name a second time to prevent mongoose from pluralizing or adding 's' to the collection name

export { TrashModel };