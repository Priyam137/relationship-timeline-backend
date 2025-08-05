import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Setup for __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route: POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // ✅ Send absolute URL
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

export default router;
