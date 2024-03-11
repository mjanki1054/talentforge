import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import SideBar from "./Components/Leftbar";

//Start Candidate

// End Candidate
// Start Exam
import ExamDashboard from "./Components/Admin/Exam/Dashboard/ExamDashboard";
import EditExam from "./Components/Admin/Exam/Actions/EditExam";
// End Exam
// Start Group
import GroupDashboard from "./Components/Admin/Group/Dashboard/GroupDashboard";
import EditGroup from "./Components/Admin/Group/Action/EditGroup";
// End Group
// Start Question
import QuestionDashboard from "./Components/Admin/Question/Dashboard/QuestionDashboard";
import SubjectList from "./Components/Admin/Question/AllSubject/SubjectList";
// lists of Subjects
import SubjectQues from "./Components/Admin/Question/AllSubject/SubjectQues/index";
import ManualQues from "./Components/Admin/Question/AllSubject/SubjectQues/ManualQues";
// End Question
// Start Subject
import SubjectDashboard from "./Components/Admin/Subject/Dashboard/SubjectDashboard";
// End Subject
// Start Dashboard
import Dashboard from "./Components/Admin/Dashboard";
// End Dashboard
// Start Setting
import Setting from "./Components/Admin/Setting";
//End Setting
import Login from "./Components/Login";
// User Start
import User from "./Components/User/User";
import Instruction from "./Components/User/Instruction"
// User End
import QuestionSetall from "./Components/Admin/Question/QuestionView/Questionsetview";
import Admin from "./Components/Admin/AdminAccount/Admin";
import AddAdmin from "./Components/Admin/AdminAccount/addAdmin"
import ViewAdmin from "./Components/Admin/AdminAccount/viewAdmin"
import EditAdmin from "./Components/Admin/AdminAccount/editAdmin"
import NotFound from "./Components/NotFound"
import CandidateDashboard from "./Components/Admin/Candidate/Dashboard/Dashboard";

// Reult Start
import ResultAdmin from "./Components/Admin/Results/index";
// Result End

// user
import Exam from "./Components/User/Exam";
import Result from "./Components/User/Result";

// myaccount
import Myaccount from "./Components/Admin/Myaccount";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route exact path="/user" element={<User />} />
        <Route exact path="/instruction" element={<Instruction />} />
        <Route exact path="/exam" element={<Exam/>} />
        <Route exact path="/result" element={<Result/>} />
        <Route exact path="/myaccount" element={<Myaccount/>} />

        <Route path="*" element={
          <>
            <Header />
            <div className="mt-0">
              <div className="mx-auto flex bg-gray-100">
                <div className="w-[222px] flex">
                  <SideBar />
                </div>
                <div
                  className="container bg-gray-100 scrollbar-thin scrollbar-thumb-gray-400"
                  style={{ overflowY: "scroll", maxHeight: "100vh" }}
                >
                  <Routes>
                    <Route exact path="/admin/home" element={<Dashboard />} />
                    <Route exact path="/candidate/add" element={<CandidateDashboard />} />

                    <Route exact path="/group/add" element={<GroupDashboard />} />
                    <Route
                      exact
                      path="/group/edit/:id"
                      element={<EditGroup />}
                    />
                    <Route exact path="/exam/add" element={<ExamDashboard />} />
                    <Route
                        exact
                        path="/exam/edit/:id"
                        element={<EditExam />}
                      />

                    <Route
                      exact
                      path="/questionset/add"
                      element={<QuestionDashboard />}
                    />
                    <Route
                      exact
                      path="/questionset/subjects/:id"
                      element={<SubjectList />}
                    />
                    <Route
                      exact
                      path="/questionset/subject/:subjectName/:id"
                      element={<SubjectQues />}
                    />
                    <Route
                      exact
                      path="/questionset/subject/:subjectName/add/:id"
                      element={<ManualQues />}
                    />

                    <Route
                      exact
                      path="/subject/add"
                      element={<SubjectDashboard />}
                    />
                    <Route exact path="/setting" element={<Setting />} />
                    <Route exact path="/setting/Account" element={< Admin />} />
                    <Route exact path="/setting/add" element={< AddAdmin />} />
                    <Route exact path="/setting/view/:id" element={< ViewAdmin />} />
                    <Route exact path="/setting/edit/:id" element={< EditAdmin />} />
                    <Route exact path="/questionset/view/:id" element={<QuestionSetall />} />
                    <Route exact path="/results" element={<ResultAdmin/>} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </div>
          </>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App