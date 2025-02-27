const DB = require("../DB/dbConfig");

const viewCourses = async (req, res) => {
    const query = "SELECT * FROM course";
    DB.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch courses" });
        return res.json(results.length > 0 ? results : "No courses found");
    });
};
module.exports = { viewCourses };