import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  FormControl,
  Autocomplete,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Sidebar from "../Sidebar";

const AssignCourseToTeacher = () => {
  const [teacher, setTeacher] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Fetch teachers
  useEffect(() => {
    fetch("http://localhost:8081/teacher/view")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setTeacher(data);
        else setTeacher([]);
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  // Fetch courses
  useEffect(() => {
    fetch("http://localhost:8081/winterSummer/courses")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedCourses = data.map((course) => ({
            ...course,
            displayName: `${course.course_code} - ${course.course_title} (${course.sessionName} - ${course.year})`,
          }));
          setCourses(formattedCourses);
        } else setCourses([]);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Function to add selected course with assigned teacher
  const handleAddCourse = (event, newValue) => {
    if (newValue && selectedTeacher) {
      const isDuplicate = selectedCourses.some(
        (course) =>
          course.course_code === newValue.course_code &&
          course.sessionId === newValue.sessionId
      );

      if (!isDuplicate) {
        setSelectedCourses([
          ...selectedCourses,
          { ...newValue, instructor: selectedTeacher.name },
        ]);
      }
    } else {
      alert("Please select a teacher before adding a course.");
    }
  };

  // Remove course from assigned list
  const handleRemoveCourse = (courseCode) => {
    setSelectedCourses(selectedCourses.filter((course) => course.course_code !== courseCode));
  };

  // Save assigned courses
  const handleSave = async () => {
    if (!selectedTeacher || !selectedTeacher.teacherId) {
      alert("Please select a teacher before saving.");
      return;
    }

    if (selectedCourses.length === 0) {
      alert("No courses selected for assignment.");
      return;
    }

    const dataToSave = selectedCourses.map((course) => ({
      teacherId: selectedTeacher.teacherId,
      courseId: course.courseId,
      sessionId: course.sessionId,
    }));

    try {
      const response = await fetch("http://localhost:8081/assigncourse/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        alert("Courses assigned successfully!");
        setSelectedCourses([]);
      } else {
        const result = await response.json();
        console.error("Failed to assign courses:", result.error);
      }
    } catch (error) {
      console.error("Error saving courses:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Card style={{ marginBottom: "20px", padding: "20px" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              Assign Course to Teacher
            </Typography>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
              {/* Select Teacher */}
              <FormControl fullWidth>
                <Autocomplete
                  options={teacher}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(event, newValue) => setSelectedTeacher(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select Teacher" variant="outlined" />}
                />
              </FormControl>

              {/* Select Course */}
              <FormControl fullWidth>
                <Autocomplete
                  options={courses}
                  getOptionLabel={(option) => option.displayName || "Unknown Course"}
                  onChange={handleAddCourse}
                  renderInput={(params) => <TextField {...params} label="Select Course" variant="outlined" />}
                />
              </FormControl>

              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: "20px" }}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Courses Table */}
        <Card>
          <CardContent>
            <Typography variant="h6">Assigned Courses</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Course Code</strong></TableCell>
                  <TableCell><strong>Course Name</strong></TableCell>
                  <TableCell><strong>Session Name</strong></TableCell>
                  <TableCell><strong>Session Year</strong></TableCell>
                  <TableCell><strong>Instructor Name</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedCourses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.course_code}</TableCell>
                    <TableCell>{course.course_title}</TableCell>
                    <TableCell>{course.sessionName}</TableCell>
                    <TableCell>{course.year}</TableCell>
                    <TableCell>{course.instructor || "Not Assigned"}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleRemoveCourse(course.course_code)} color="error">
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignCourseToTeacher;
