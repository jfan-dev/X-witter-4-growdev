import { getFeed } from "../services/feed.service.js";

export async function feed(req, res) {
  try {
    const tweets = await getFeed(req.userId);
    return res.status(200).json(tweets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}