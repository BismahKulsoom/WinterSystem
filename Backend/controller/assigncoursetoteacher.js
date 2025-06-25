const DB = require("../DB/dbConfig");

const assignCoursesToTeacher = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: "Invalid or empty data received" });
    }

    const query = "INSERT INTO assigncoursetoteacher (teacherId, courseId, sessionId) VALUES ?";
    const values = data.map(item => [item.teacherId, item.courseId, item.sessionId]);

    DB.query(query, [values], (err, results) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to assign courses" });
        }
        return res.json({ message: "Courses assigned successfully", results });
    });
};
module.exports={assignCoursesToTeacher};