const DB = require("../DB/dbConfig");

const saveWinterSummerCourses = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: "Invalid or empty data received" });
    }

    const query = "INSERT INTO wintersummerform (studentId, courseId, sessionId, failing_status) VALUES ?";
    const values = data.map(item => [item.studentId, item.courseId, item.sessionId, JSON.stringify(item.failing_status)]);

    DB.query(query, [values], (err, results) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to save data" });
        }
        return res.json({ message: "Data saved successfully", results });
    });
};

module.exports = { saveWinterSummerCourses };
