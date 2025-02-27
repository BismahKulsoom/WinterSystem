// routes/courseRoutes.js
const express = require("express");
const { viewCourses } = require("../controller/course");
const courseRouter = express.Router();
courseRouter.get("/view", viewCourses);
module.exports = { courseRouter };
