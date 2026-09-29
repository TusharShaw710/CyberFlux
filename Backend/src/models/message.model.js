import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    file: {
      name: String,
      fileType: String,
    },
    fileContext: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
