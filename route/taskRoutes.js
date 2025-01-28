const express = require("express");
const {
  addTask,
  getTasks,
  updateTask,
} = require("../controller/task.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/tasks", authMiddleware, addTask);
router.get("/tasks", authMiddleware, getTasks);
router.put("/tasks/:id", authMiddleware, updateTask);

module.exports = router;
