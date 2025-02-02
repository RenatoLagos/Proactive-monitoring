import { Router } from "express"
import { createRobots } from "./handlers/robots"

const router = Router()

router.get("/", (req, res) => {
  res.json("From Get")
})

router.post("/", createRobots)

router.put("/", (req, res) => {
    res.json("From put")
})

router.patch("/", (req, res) => {
    res.json("From Patch")
})

router.delete("/", (req, res) => {
    res.json("From Delete")
})

export default router