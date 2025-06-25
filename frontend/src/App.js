import logo from './logo.svg';
import './App.css';
import HomePage from './Components/HomePage';
import AssignCourseToTeacher from './Components/AssignCourseToTeacher';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseWiseReport from './Components/CourseWiseReport';


function App() {
  return (
  <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="assignCourse"element={<AssignCourseToTeacher/>}/>
    <Route path="coursereport" element={<CourseWiseReport/>}/>.
  </Routes>
  </BrowserRouter>


  </>  );
}

export default App;
