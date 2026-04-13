import { Router } from "express";

const router = Router();

router.get("/:id", (req, res) => {
    return res.json({ message: "users route working"})
})

router.post("/:id/follow", (req, res) => {
    return res.json({ message: "users follow route working"})
})

router.delete("/:id/follow", (req, res) => {
    return res.json({ message: "users unfollow route working"})
})

export default router