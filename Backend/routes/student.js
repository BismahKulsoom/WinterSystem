const express=require("express");
const { viewStudents } = require("../controller/student");
const studentRouter = express.Router();
studentRouter.get("/view", viewStudents);
module.exports = { studentRouter };