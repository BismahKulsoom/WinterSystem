const express=require("express");
const { viewSession } = require("../controller/session");
const sessionRouter = express.Router();
sessionRouter.get("/view", viewSession);
module.exports = { sessionRouter };