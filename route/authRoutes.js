const express = require("express");
const { signupUser, loginUser } = require("../controller/auth.controller");

const router = express.Router();

router.post("/signup", signupUser); // Signup Route
router.post("/login", loginUser); // Login Route

module.exports = router;
