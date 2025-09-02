const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

const connectToMongoDb = require("./config/connection");

connectToMongoDb(MONGO_URI)
  .then(() => console.log("Connect mongoDB"))
  .catch((err) => console.log("mongoDB connection failed", err));

app.listen(PORT, () => console.log(`Server running at PORT:${PORT}`));
