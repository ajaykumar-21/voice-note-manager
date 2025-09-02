const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getNotes, createNote } = require("../controllers/note");

// simple disk storage for audio
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes

router.post("/", upload.single("audio"), createNote);
router.get("/", getNotes);

module.exports = router;
