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

const getWinterSummerCourses = async (req, res) => {
    const query = `
        SELECT DISTINCT c.courseId, c.course_code, c.course_title, ws.sessionId, s.sessionName ,s.year
        FROM wintersummerform ws
        JOIN session s ON ws.sessionId = s.sessionId
        JOIN course c ON ws.courseId = c.courseId
        
    `;

    DB.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch teachers" });
        return res.json(results.length > 0 ? results : "No session and courses found");
    });
};





module.exports = { saveWinterSummerCourses,getWinterSummerCourses };
