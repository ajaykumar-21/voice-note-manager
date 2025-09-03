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
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        transcript,
        summary: "",
      },
      { new: true } // ✅ return updated document instead of old one
    );

    return res.json(note);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};

//Delete note and remove audio file
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    // console.log(note);

    if (note?.audioPath) {
      const path = note.audioPath.replace(/^\//, "");
      // console.log(path);
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }

    return res.json({ mssg: "Delete note and remove audio file" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
};

// Summarize note
const summarizeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Not found" });
    if (note.summary)
      return res.status(400).json({ error: "Already summarized" });

    const prompt = `Summarize the following meeting/voice note in 2-3 bullet points. Keep it crisp.\n\nTEXT:\n${note.transcript}`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });
    // console.log(response);

    const summary = response.output[0].content[0].text;
    // console.log(summary);
    note.summary = summary;
    await note.save();
    return res.json(note);
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Summarization failed" });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  summarizeNote,
};
