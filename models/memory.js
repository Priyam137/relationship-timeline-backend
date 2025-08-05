import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    photo: { type: String, required: true },
    memory: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);
