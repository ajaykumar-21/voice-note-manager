const express = require("express");
const router = express.Router();

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

router.post("/", upload.single("audio"));

module.exports = router;
