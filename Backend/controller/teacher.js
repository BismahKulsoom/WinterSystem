const DB = require("../DB/dbConfig");

const viewTeacher = async (req, res) => {
    const query = "SELECT * FROM teacher";
    DB.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch teachers" });
        return res.json(results.length > 0 ? results : "No teachers found");
    });
};
module.exports = { viewTeacher };