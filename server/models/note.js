const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    transcript: { type: String, required: true },
    audioPath: { type: String },
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

const Note = mongoose.model("note", noteSchema);

module.exports = Note;
