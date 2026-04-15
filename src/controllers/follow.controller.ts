import { followUser, unfollowUser } from "../services/follow.service.js";

export async function follow(req, res) {
  try {
    const result = await followUser(req.userId, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function unfollow(req, res) {
  try {
    const result = await unfollowUser(req.userId, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}