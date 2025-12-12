const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user.controller");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/login", usersController.loginUser);

router.post(
  "/signup", authMiddleware, usersController.signUp
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {});
  }

  res.clearCookie("token", { path: "/" });
  res.clearCookie("connect.sid", { path: "/" });

  return res.status(200).json({ message: "Logout exitoso" });
});

module.exports = router;
