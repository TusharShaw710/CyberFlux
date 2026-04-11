import mongoose from "mongoose";

const userEmailSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: String,
  refresh_token: String,
});

export default mongoose.model("UserEmail", userEmailSchema);