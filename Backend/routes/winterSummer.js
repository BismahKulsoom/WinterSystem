const express = require("express");
const { saveWinterSummerCourses, getWinterSummerCourses } = require("../controller/winterSummer");

const winterSummerRouter = express.Router();

winterSummerRouter.route('/save').post(saveWinterSummerCourses);
winterSummerRouter.get("/courses",getWinterSummerCourses)

module.exports = { winterSummerRouter };
