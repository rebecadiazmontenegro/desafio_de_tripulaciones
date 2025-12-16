const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user.controller");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validateCreateUser,
  validateLoginUser,
} = require("../validator/users.validator");

router.post("/login", validateLoginUser, usersController.loginUser);

router.post(
  "/signup",
  authMiddleware,
  validateCreateUser,
  usersController.signUp
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {});
  }

  res.clearCookie("token", { path: "/" });
  res.clearCookie("connect.sid", { path: "/" });

  return res.status(200).json({ message: "Logout exitoso" });
});

router.get(
  "/managers",
  authMiddleware, 
  usersController.getAllManagers
);

router.get(
  "/workers",
  authMiddleware, 
  usersController.getAllWorkers
);

router.delete("/:email", authMiddleware, usersController.deleteUser);

// router.put("/change-password", usersController.updatePassword);
router.put("/change/password", authMiddleware, usersController.changePasswordUnified);


module.exports = router;
