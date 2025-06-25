const DB = require("../DB/dbConfig");

const getCourseWiseReport = (req, res) => {
  const { sessionName, year } = req.query;

  if (!sessionName || !year) {
    return res.status(400).json({ error: "Session name and year are required" });
  }

  const query = `
    SELECT 
      c.course_code,
      c.course_title,
      COUNT(DISTINCT ws.studentId) AS totalStudents,
      GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS student_names
    FROM 
      course c
    LEFT JOIN 
      wintersummerform ws ON c.courseId = ws.courseId
    LEFT JOIN 
      student s ON ws.studentId = s.studentId
    LEFT JOIN 
      session se ON ws.sessionId = se.sessionId
    WHERE 
      se.sessionName = ? AND se.year = ?
    GROUP BY 
      c.course_code, c.course_title
    ORDER BY 
      c.course_code ASC;
  `;

  DB.query(query, [sessionName, year], (err, results) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.status(500).json({ error: "Failed to fetch report" });
    }

    res.json({ report: results });
  });
};
const getAllSessions = (req, res) => {
  const query = `SELECT DISTINCT CONCAT(sessionName, ' ', year) AS fullSession FROM session ORDER BY year DESC, sessionName ASC`;

  DB.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ error: "Failed to fetch sessions" });
    }

    res.json(results.map(row => row.fullSession));
  });
};

module.exports = { getCourseWiseReport,getAllSessions };
