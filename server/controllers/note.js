const fs = require("fs-extra");
const Note = require("../models/note");
const openai = require("../openai");

//get all notes
const getNotes = async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  return res.json(notes);
};

// Create note: receives audio, transcribes with OpenAI Whisper, saves transcript
const createNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file found" });
    }

    const audioPath = "/" + req.file.path.replace(/\\/g, "/");

    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });

    // console.log(transcription.text);

    const note = await Note.create({
      transcript: transcription.text || "",
      audioPath,
      summary: "",
    });

    return res.status(201).json(note);
  } catch (error) {
    // console.error("Error while creating", error);
    res.status(500).json({ error: "failed to create note" });
  }
};

// Update transcript and clears summary
const updateNote = async (req, res) => {
  try {
    const { transcript } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, {
      transcript,
      summary: "",
    });

    return res.json(note);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};

//Delete note and remove audio file
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    console.log(note);

    if (note?.audioPath) {
      const p = note.audioPath.replace(/^\//, "");
      console.log(p);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    return res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
