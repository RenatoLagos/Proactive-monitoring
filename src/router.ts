import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json("From Get");
});

router.post("/", (req, res) => {
    res.json("From Post");
});

router.put("/", (req, res) => {
    res.json("From put");
});

router.patch("/", (req, res) => {
    res.json("From Patch");
});

router.delete("/", (req, res) => {
    res.json("From Delete");
});

export default router;