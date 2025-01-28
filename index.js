require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./route/authRoutes");
const taskRoutes = require("./route/taskRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
