const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const envFilePath = path.join(
  path.resolve(path.dirname(path.dirname(__dirname))),
  ".env"
);

dotenv.config({ path: envFilePath });

const app = express();

const PORT = process.env.QUESTION_SERVICE_PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello World from question-service" });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
