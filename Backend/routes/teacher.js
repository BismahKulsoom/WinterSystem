const express=require("express");
const { viewTeacher } = require("../controller/teacher");
const teacherRouter = express.Router();
teacherRouter.get("/view", viewTeacher);
module.exports = { teacherRouter };