const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user.controller");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/login", usersController.loginUser);

router.post(
  "/signup", authMiddleware, usersController.signUp
);

module.exports = router;
