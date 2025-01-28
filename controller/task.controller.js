const Task = require("../models/Task.model");

exports.addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId; // Extract userId from the token

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    // Check for duplicate tasks
    const existingTask = await Task.findOne({ userId, title, description });
    if (existingTask) {
      return res.status(400).json({ message: "Duplicate Task Not Allowed" });
    }

    // Create new task
    const task = await Task.create({ userId, title, description });
    res
      .status(201)
      .json({ status: 201, data: task, message: "Task create successfully" });
  } catch (error) {
    console.error("Error in addTask:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId; // Extract userId from token

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    // Create search query
    const query = search
      ? { userId, title: new RegExp(search, "i") }
      : { userId };

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Fetch tasks with pagination
    const tasks = await Task.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(task);
};
