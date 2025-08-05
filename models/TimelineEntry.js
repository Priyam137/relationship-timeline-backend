const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  date: { type: String, required: true },
  photoUrl: { type: String, required: true },
  memory: { type: String, required: true },
});

module.exports = mongoose.model("TimelineEntry", schema);
