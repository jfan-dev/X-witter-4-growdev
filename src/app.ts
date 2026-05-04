import express from 'express'
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import xweetsRoutes from "./routes/xweets.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { errorHandler } from "./middlewares/error-handler.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://x-witter-4-growdev.vercel.app/",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/auth", authRoutes);
app.use("/xweets", xweetsRoutes);
app.use("/feed", feedRoutes);
app.use("/users", usersRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app
