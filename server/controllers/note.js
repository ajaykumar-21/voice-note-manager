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
    console.error("Error while creating", error);
    res.status(500).json({ error: "failed to create note" });
  }
};

module.exports = {
  getNotes,
  createNote,
};
