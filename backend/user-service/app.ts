import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";

import userRoutes from "./routes/user-routes.js";
import authRoutes from "./routes/auth-routes.js";

const file = fs.readFileSync("./swagger.yml", "utf-8");
const swaggerDocument = yaml.parse(file);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// To handle CORS Errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("Sending Greetings!");
  res.json({
    message: "Hello World from user-service",
  });
});

export default app;
