const express = require("express");
const {
  signup,
  login,
  protect,
  anycon,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/any", protect, anycon);

module.exports = router;
