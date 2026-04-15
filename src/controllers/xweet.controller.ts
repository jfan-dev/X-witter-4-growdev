import { replyToXweet, createXweet } from "../services/xweet.service.js";

export async function create(req, res) {
  try {
    const xweet = await createXweet(req.userId, req.body.content);
    return res.status(201).json(xweet);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function reply(req, res) {
  try {
    const xweet = await replyToXweet(
      req.userId,
      req.params.id,
      req.body.content
    );
    return res.status(201).json(xweet);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}