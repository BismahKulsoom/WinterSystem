const DB = require("../DB/dbConfig");

const viewSession = async (req, res) => {
    const query = "SELECT * FROM session";
    DB.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch courses" });
        return res.json(results.length > 0 ? results : "No courses found");
    });
};
module.exports = { viewSession };