const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/authMiddleware");


router.post('/chat', authMiddleware, chatController.saveMessages);

router.get('/history-chat', authMiddleware, chatController.getMessages);

module.exports = router;