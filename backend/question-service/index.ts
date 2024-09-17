import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";

const envFilePath = path.join(
  path.resolve(path.dirname(path.dirname(__dirname))),
  ".env",
);

const file = fs.readFileSync("./swagger.yml", "utf-8");
const swaggerDocument = yaml.parse(file);

dotenv.config({ path: envFilePath });

const app: Express = express();

const PORT = process.env.QUESTION_SERVICE_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello world from question service" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
