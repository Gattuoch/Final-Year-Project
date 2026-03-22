import express from "express";

const router = express.Router();

import {
  createTicket,
  getTickets,
  getTicketById,
} from "../controllers/ticketController.js";

router.post("/tickets", createTicket);

router.get("/tickets", getTickets);

router.get("/tickets/:id", getTicketById);

export default router;