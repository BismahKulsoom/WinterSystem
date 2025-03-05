import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, TextField, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import { Button, FormControl, Autocomplete } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Sidebar from "../Sidebar";

const HomePage = () => {
  const [student, setStudent] = useState({ studentId:"",enrollmentNo: "", name: "" });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null); // Fix: Store selected session


  useEffect(() => {
    fetch("http://localhost:8081/student/view") 
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("Expected an array but got:", data);
          setStudents([]); // Prevents crashes
        }
      })
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/course/view") 
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("Expected an array but got:", data);
          setCourses([]); // Prevents crashes
        }
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/session/view") 
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSessions(data);
        } else {
          console.error("Expected an array but got:", data);
          setSessions([]); // Prevents crashes
        }
      })
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const handleAddCourse = (event, newValue) => {
    if (newValue && !selectedCourses.some(course => course.course_code === newValue.course_code)) {
      setSelectedCourses([...selectedCourses, { ...newValue, failing_status: { mid: false, terminal: true, lab: false } }]);
    }
  };

  const handleRemoveCourse = (courseCode) => {
    setSelectedCourses(selectedCourses.filter(course => course.course_code !== courseCode));
  };

  const handleCheckboxChange = (courseCode, type) => {
    setSelectedCourses(selectedCourses.map(course => 
      course.course_code === courseCode ? { ...course, failing_status: { ...course.failing_status, [type]: !course.failing_status[type] } } : course
    ));
  };

  const handleSave = () => {
    console.log("Selected Student ID:", student.studentId); // Debugging Log
  
    if (!student.studentId) {
      console.error("Error: Student ID is missing.");
      return; // Stop execution if studentId is missing
    }
  
    const dataToSave = selectedCourses.map(course => ({
      studentId: student.studentId, // Ensure this is not null
      courseId: course.courseId,
      sessionId: selectedSession?.sessionId, // Handle null session selection
      failing_status: course.failing_status
    }));
  
    fetch("http://localhost:8081/winterSummer/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave)
    })
      .then(response => response.json()) 
      .then(data => {
        if (data?.message === "Data saved successfully") { // Check correct response structure
          console.log("Data saved successfully:", data);
          window.alert("Data saved successfully!"); // ✅ Show alert
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch(error => console.error("Error saving data:", error));
  };
  
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Card style={{ marginBottom: "20px", padding: "20px" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">Winter Session Enrollment</Typography>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => option.enrollment}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setStudent({ studentId: newValue.studentId, enrollmentNo: newValue.enrollment, name: newValue.name });
                  }
                }}
                renderInput={(params) => <TextField {...params} label="Enrollment No" variant="outlined" />}
              />

              <TextField
                label="Student Name"
                variant="outlined"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
              />

<FormControl fullWidth>
                <Autocomplete
                  options={sessions}
                  getOptionLabel={(option) => option.sessionName}
                  onChange={(event, newValue) => setSelectedSession(newValue)} // Fix: Store selected session properly
                  renderInput={(params) => <TextField {...params} label="Select Session" variant="outlined" />}
                />
              </FormControl>

              <FormControl fullWidth>
                <Autocomplete
                  options={courses}
                  getOptionLabel={(option) => `${option.course_code} - ${option.course_title}`}
                  onChange={handleAddCourse}
                  renderInput={(params) => <TextField {...params} label="Select Course" variant="outlined" />}
                />
              </FormControl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6">Selected Courses</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Course Code</strong></TableCell>
                  <TableCell><strong>Course Name</strong></TableCell>
                  <TableCell><strong>Failing Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCourses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.course_code}</TableCell>
                    <TableCell>{course.course_title}</TableCell>
                    <TableCell>
                      <FormControlLabel control={<Checkbox checked={course.failing_status.mid} onChange={() => handleCheckboxChange(course.course_code, "mid")} />} label="Mid" />
                      <FormControlLabel control={<Checkbox checked={course.failing_status.terminal} onChange={() => handleCheckboxChange(course.course_code, "terminal")} />} label="Terminal" />
                      <FormControlLabel control={<Checkbox checked={course.failing_status.lab} onChange={() => handleCheckboxChange(course.course_code, "lab")} />} label="Lab" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleRemoveCourse(course.course_code)} color="error"><CloseIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: "20px" }}>Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

// import React, { useState, useEffect } from "react";
// import { Card, CardContent, Typography, TextField } from "@mui/material";
// import { Button, FormControl, Autocomplete } from "@mui/material";
// import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
// import Sidebar from "../Sidebar";

// const HomePage = () => {
//   const [student, setStudent] = useState({ enrollmentNo: "", name: "" });
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [sessions, setSessions] = useState([]);

//   // Fetch students from backend
//   useEffect(() => {
//     fetch("http://localhost:8081/student/view") 
//       .then((response) => response.json())
//       .then((data) => setStudents(data))
//       .catch((error) => console.error("Error fetching students:", error));
//   }, []);

//   // Fetch courses from backend
//   useEffect(() => {
//     fetch("http://localhost:8081/course/view") 
//       .then((response) => response.json())
//       .then((data) => setCourses(data))
//       .catch((error) => console.error("Error fetching courses:", error));
//   }, []);

//   // Fetch sessions from backend
//   useEffect(() => {
//     fetch("http://localhost:8081/session/view") 
//       .then((response) => response.json())
//       .then((data) => setSessions(data))
//       .catch((error) => console.error("Error fetching sessions:", error));
//   }, []);

//   const handleAddCourse = (event, newValue) => {
//     if (newValue && !selectedCourses.includes(newValue)) {
//       setSelectedCourses([...selectedCourses, newValue]);
//     }
//   };

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: "20px" }}>
//         <Card style={{ marginBottom: "20px", padding: "20px" }}>
//           <CardContent>
//             <Typography variant="h5" fontWeight="bold">
//               Winter Session Enrollment
//             </Typography>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
//               {/* Enrollment Number Dropdown */}
//               <Autocomplete
//                 options={students}
//                 getOptionLabel={(option) => option.enrollment}
//                 onChange={(event, newValue) => {
//                   if (newValue) {
//                     setStudent({ enrollmentNo: newValue.enrollment, name: newValue.name });
//                   }
//                 }}
//                 renderInput={(params) => <TextField {...params} label="Enrollment No" variant="outlined" />}
//               />

//               {/* Student Name Field */}
//               <TextField
//                 label="Student Name"
//                 variant="outlined"
//                 value={student.name}
//                 onChange={(e) => setStudent({ ...student, name: e.target.value })}
//               />

//               {/* Session Dropdown */}
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={sessions}
//                   getOptionLabel={(option) => option.sessionName }
//                   onChange={(event, newValue) => setSessions(newValue)}
//                   renderInput={(params) => <TextField {...params} label="Select Session" variant="outlined" />}
//                 />
//               </FormControl>

//               {/* Course Selection Dropdown */}
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={courses}
//                   getOptionLabel={(option) => `${option.course_code} - ${option.course_title}`}
//                   onChange={handleAddCourse}
//                   renderInput={(params) => <TextField {...params} label="Select Course" variant="outlined" />}
//                 />
//               </FormControl>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Selected Courses Table */}
//         <Card>
//           <CardContent>
//             <Typography variant="h6">Selected Courses</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>Course Code</strong></TableCell>
//                   <TableCell><strong>Course Name</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {selectedCourses.map((course, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{course.course_code}</TableCell>
//                     <TableCell>{course.course_title}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
