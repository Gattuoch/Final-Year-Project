const express = require("express");
const {
  signupCamper,
  login,
  createInternalUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

const router = express.Router();

router.post("/signup/camper", signupCamper);
router.post("/login", login);

router.post(
  "/internal-users",
  protect,
  allowRoles("system_admin", "super_admin"),
  createInternalUser
);

module.exports = router;
