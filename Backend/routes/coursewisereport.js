const express = require("express");
const { getCourseWiseReport,getAllSessions } = require("../controller/coursewisereport");

const courseWiseRouter = express.Router();
courseWiseRouter.get("/sessions", getAllSessions);
courseWiseRouter.get("/report", getCourseWiseReport);

module.exports = { courseWiseRouter };
