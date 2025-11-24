import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface WalletUserDocument extends Document {
  userHandle: string;
  credentialID: string;
  credentialPublicKey: Buffer;
  counter: number;
  encryptedSeed: string;
  iv: string;
  encryptionKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletUserSchema = new Schema<WalletUserDocument>(
  {
    userHandle: { type: String, required: true, unique: true },
    credentialID: { type: String, required: true },
    credentialPublicKey: { type: Buffer, required: true },
    counter: { type: Number, required: true, default: 0 },
    encryptedSeed: { type: String, required: true },
    iv: { type: String, required: true },
    encryptionKey: { type: String, required: true },
  },
  { timestamps: true },
);

const WalletUser: Model<WalletUserDocument> =
  mongoose.models.WalletUser || mongoose.model<WalletUserDocument>('WalletUser', WalletUserSchema);

export default WalletUser;
