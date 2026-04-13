import { signin, signup } from "../services/auth.service.js";

export async function authSignup(req, res) {
  try {
    const user = await signup(req.body);

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

export async function authSignin(req, res) {
  try {
    const user = await signin(req.body);

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}