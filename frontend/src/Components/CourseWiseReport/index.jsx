import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Sidebar from "../Sidebar";

const CourseWiseReport = () => {
  const [sessions, setSessions] = useState([]); // dropdown options
  const [selectedSession, setSelectedSession] = useState(""); // user selected value
  const [reportData, setReportData] = useState([]); // course-wise report data

  // 🔹 Step 1: Fetch session list for dropdown
  useEffect(() => {
    fetch("http://localhost:8081/coursewise/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data); // Example: ["Winter 2024", "Summer 2025"]
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  }, []);

  // 🔹 Step 2: Fetch report for selected session
  useEffect(() => {
    if (selectedSession) {
      const [sessionName, year] = selectedSession.split(" "); // Example: "Winter 2024" → ["Winter", "2024"]

      fetch(
        `http://localhost:8081/coursewise/report?sessionName=${sessionName}&year=${year}`
      )
        .then((res) => res.json())
        .then((data) => {
          setReportData(data.report || []);
        })
        .catch((err) => console.error("Error fetching report:", err));
    }
  }, [selectedSession]);

  // 🔹 Table Renderer
  const renderTable = () => (
    <Card style={{ marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Report for: {selectedSession}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Course Code</strong></TableCell>
              <TableCell><strong>Course Title</strong></TableCell>
              <TableCell><strong>Total Students</strong></TableCell>
              <TableCell><strong>Student Names</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.course_code}</TableCell>
                <TableCell>{row.course_title}</TableCell>
                <TableCell>{row.totalStudents}</TableCell>
                <TableCell>{row.student_names || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Course-wise Student Enrollment Report
        </Typography>

        {/* 🔽 Dropdown */}
        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel>Select Session</InputLabel>
          <Select
            value={selectedSession}
            label="Select Session"
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            {sessions.map((session, index) => (
              <MenuItem key={index} value={session}>
                {session}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 📊 Show table if a session is selected */}
        {selectedSession && renderTable()}
      </div>
    </div>
  );
};

export default CourseWiseReport;
