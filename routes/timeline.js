const express = require("express");
const router = express.Router();
const TimelineEntry = require("../models/TimelineEntry");

// 📥 Get all timeline entries
router.get("/", async (req, res) => {
  try {
    const entries = await TimelineEntry.find().sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ message: "Failed to fetch timeline entries" });
  }
});

// ➕ Create a new memory entry
router.post("/", async (req, res) => {
  try {
    const { date, photoUrl, memory } = req.body;

    const newEntry = new TimelineEntry({ date, photoUrl, memory });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error saving entry:", err);
    res.status(500).json({ message: "Failed to save timeline entry" });
  }
});

// ✏️ Update (edit) a memory entry by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedEntry = await TimelineEntry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(updatedEntry);
  } catch (err) {
    console.error("Error updating entry:", err);
    res.status(500).json({ message: "Failed to update entry" });
  }
});

module.exports = router;
