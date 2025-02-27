const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { courseRouter } = require('./routes/course');
const { studentRouter } = require("./routes/student");
const DB = require("./DB/dbConfig");
const { sessionRouter } = require("./routes/session");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/course", courseRouter);
app.use("/student", studentRouter);
app.use("/session",sessionRouter);

DB.connect(err => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to database");
});

app.listen(8081, () => console.log("Server running on port 8081"));
