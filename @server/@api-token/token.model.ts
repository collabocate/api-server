import { UserDocument } from '@user/user.model';
import mongoose from 'mongoose';

export enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
}

export enum TokenIssuer {
  Server = 'server',
  Github = 'github',
  Google = 'google',
}

export interface TokenDocument extends mongoose.Document {
  _id?: string;
  token: string;
  type: string;
  issuer: string;
  createdAt?: Date;
  user: UserDocument;
}

const collectionName = 'token';

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  type: { type: String, required: true },
  issuer: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref:"user", required: true }
},
{
  timestamps: true,
});

const TokenModel = mongoose.model<TokenDocument>(collectionName, TokenSchema, collectionName); //declare collection name a second time to prevent mongoose from pluralizing or adding 's' to the collection name

export { TokenModel };