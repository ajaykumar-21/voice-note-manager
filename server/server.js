const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://voice-note-manager.vercel.app/"],
    credentials: true,
  })
);

const connectToMongoDb = require("./config/connection");

//routes
const notesRoute = require("./routes/note");

app.use("/api/notes", notesRoute);

connectToMongoDb(MONGO_URI)
  .then(() => console.log("Connect mongoDB"))
  .catch((err) => console.log("mongoDB connection failed", err));

app.listen(PORT, () => console.log(`Server running at PORT:${PORT}`));
