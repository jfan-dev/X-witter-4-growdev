import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
    return res.json({ message: "xweets route working"})
})

router.post("/:id/reply", (req, res) => {
    return res.json({ message: "xweets reply route working"})
})

router.post("/:id/like", (req, res) => {
    return res.json({ message: "xweets like route working"})
})

router.delete("/:id/like", (req, res) => {
    return res.json({ message: "xweets delete like route working"})
})

export default router;