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
    const { search, last_id, limit = 10 } = req.query;
    const userId = req.user.userId; // Extract userId from token

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    const pageSize = parseInt(limit, 10);

    const query = search
      ? { userId, title: new RegExp(search, "i") }
      : { userId };
    if (last_id) {
      query._id = { $lt: last_id };
    }

    const tasks = await Task.find(query)
      .sort({ _id: -1 }) 
      .limit(pageSize);
    const count = await Task.countDocuments(query);

    res.status(200).json({ success: true, data: tasks, total: count });
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
