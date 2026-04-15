import { getUserProfile } from "../services/users.service.js";

export async function getUser(req, res) {
  try {
    const user = await getUserProfile(req.params.id);

    return res.json(user);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}