const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");

const envFilePath = path.join(
  path.resolve(path.dirname(path.dirname(__dirname))),
  ".env",
);

const file = fs.readFileSync("./swagger.yml", "utf-8");
const swaggerDocument = yaml.parse(file);

dotenv.config({ path: envFilePath });

const app = express();

const PORT = process.env.QUESTION_SERVICE_PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World from question-service" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
