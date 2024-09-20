import express, { Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";

import connectDB from "./config/db.ts";
import questionRoutes from "./src/routes/questionRoutes.ts";

dotenv.config();

const file = fs.readFileSync("./swagger.yml", "utf-8");
const swaggerDocument = yaml.parse(file);

const app = express();

connectDB();

app.use(express.json());
app.use("/api", questionRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello world from question service" });
});

export default app;
