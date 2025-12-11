import express from "express";
import * as campCtrl from "../controllers/campHomeController.js";

const router = express.Router();
router.get("/search", campCtrl.searchCamps);
router.get("/all", campCtrl.getAllCamps);
router.get("/", campCtrl.listCamps);
router.post("/", campCtrl.createCamp);
// router.get("/:idd", campCtrl.getCampById);
router.put("/:id", campCtrl.updateCamp);
router.delete("/:id", campCtrl.deleteCamp);
router.get("/:id", campCtrl.getCampDetails);


export default router;
