import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import Memory from "./models/memory.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// Setup for ES modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload route
app.use("/api/upload", uploadRoutes);

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Get all memories
app.get("/api/memories", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch memories" });
  }
});

// ✅ Add a new memory
app.post("/api/memories", async (req, res) => {
  try {
    const memory = new Memory(req.body);
    const saved = await memory.save();
    res.json(saved);
  } catch (err) {
    console.error("Add error:", err);
    res.status(500).json({ message: "Failed to add memory" });
  }
});

// ✅ Edit a memory
app.put("/api/memories/:id", async (req, res) => {
  try {
    const updated = await Memory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update memory" });
  }
});

// ✅ Serve frontend if built (optional)
const frontendPath = path.join(__dirname, "../client/build");
app.use(express.static(frontendPath));
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
