const express = require("express");
const { saveWinterSummerCourses } = require("../controller/winterSummer");

const winterSummerRouter = express.Router();

winterSummerRouter.route('/save').post(saveWinterSummerCourses);

module.exports = { winterSummerRouter };
