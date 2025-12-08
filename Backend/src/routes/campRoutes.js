import express from "express";
import { getCamps, addCamp } from "../controllers/campController.js";

const router = express.Router();

router.get("/", getCamps);
router.post("/", addCamp);

export default router;
