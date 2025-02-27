const DB = require("../DB/dbConfig");

const viewStudents = async (req, res) => {
    const query = "SELECT * FROM student";
    DB.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch students" });
        return res.json(results.length > 0 ? results : "No students found");
    });
};

module.exports = { viewStudents };