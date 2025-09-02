const fs = require("fs-extra");
const Note = require("../models/note");
const openai = require("../openai");

//get all notes
const getNotes = async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
};


module.exports = {
  getNotes,
};
