const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running at PORT:${PORT}`));
