import { likeXweet, unlikeXweet } from "../services/like.service.js";

export async function like(req, res) {
  try {
    const result = await likeXweet(req.userId, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function unlike(req, res) {
  try {
    const result = await unlikeXweet(req.userId, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}