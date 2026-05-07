import express from "express";
import { handleAIChat } from "../controllers/ai.controller.js";

const router = express.Router();

// A decoupled endpoint that strictly processes LLM requests and does not touch standard DB collections.
router.post("/chat", handleAIChat);

export default router;
