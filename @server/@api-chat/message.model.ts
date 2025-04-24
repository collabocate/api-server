import mongoose, { Schema } from "mongoose";

interface IMessage {
  sender: string;
  recipient: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
