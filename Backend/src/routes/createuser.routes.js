import express from 'express';
const router = express.Router();
import { createUser } from '../controllers/createuser.controller.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

router.post('/', protect, managerOrAdmin, createUser);

export default router;
