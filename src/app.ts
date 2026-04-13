import express from 'express'
import authRoutes from "./routes/auth.routes.js";
import xweetsRoutes from "./routes/xweets.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/xweets", xweetsRoutes);
app.use("/feed", feedRoutes);
app.use("/users", usersRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app
