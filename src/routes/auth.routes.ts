import { Router } from "express";

const router = Router();


//POST /auth/register
router.post("/register", (req, res) => {
  return res.json({ message: "register route working" });
});

//POST /auth/login
router.post("/login", (req, res) => {
  return res.json({ message: "login route working" });
});

export default router;