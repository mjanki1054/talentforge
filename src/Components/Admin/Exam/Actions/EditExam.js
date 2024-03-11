import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { ViewListIcon } from "@heroicons/react/outline";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const initialValue = {
  examName: "",
  assignment: "",
  negativeMarks: "",
  examDuration: "",
  examDateTime: "",
};

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(initialValue);
  const [groupNames, setGroupNames] = useState([]);
  const [questionSetNames, setQuestionSetNames] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    fetchGroupNames();
    fetchQuestionSetNames();
    loadExamDetails();
  }, []);

  const fetchGroupNames = async () => {
    try {
      const responseGroups = await axios.get(
        "http://localhost:5000/api/v1/groups"
      );
      const responseExams = await axios.get(
        "http://localhost:5000/api/v1/allexams"
      );

      const groupsData = responseGroups.data?.groups || [];
      const examsData = responseExams.data?.exams || [];

      // Get the IDs of groups already assigned to other exams
      const assignedGroupIds = examsData.reduce((assigned, exam) => {
        if (exam._id !== id) {
          return assigned.concat(exam.assignment.map((group) => group._id));
        }
        return assigned;
      }, []);
      console.log(assignedGroupIds, "line no. 59");

      // Filter out the groups that are not assigned to any exam
      const unassignedGroups = groupsData.filter((group) => {
        return !assignedGroupIds.includes(group._id);
      });
      console.log(unassignedGroups, "line no. 65");

      setGroupNames(unassignedGroups);
    } catch (error) {
      console.error(error, "line no. 74");
    }
  };

  const fetchQuestionSetNames = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/questionset"
      );

      const data = response.data;

      setQuestionSetNames(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadExamDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/exam/${id}`
      );

      const examData = response.data.exam;
      const examDateTimeLocal = new Date(examData.examDateTime)
        .toISOString()
        .slice(0, 16);

      setExam({
        ...examData,
        examDateTime: examDateTimeLocal,
      });

      // Store examData in the state variable
      setExamData(examData);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onValueChange = (e) => {
    const { name, value } = e.target;

    if (name === "assignment") {
      // Convert the selected value to an array if it's not already an array
      const selectedAssignmentsArray = Array.isArray(value) ? value : [value];

      // Update the selectedAssignments state
      setSelectedAssignments(selectedAssignmentsArray);

      // Update the exam.assignment state using the selectedAssignmentsArray
      setExam({ ...exam, [name]: selectedAssignmentsArray });
    } else {
      // For other fields, we can update them as usual
      setExam({ ...exam, [name]: value });
    }
  };

  const updateExamDetails = async () => {
    try {
      // Fetch the details of the previously assigned group (if any)
      const prevAssignedGroup = groupNames.find(
        (group) => group._id === examData.assignment[0]
      );
      console.log(prevAssignedGroup, "line no. 127");

      // Fetch the details of the newly assigned group (if any)
      const newAssignedGroup = groupNames.find(
        (group) => group._id === selectedAssignments[0]
      );
      console.log(newAssignedGroup, "line no. 133");

      // Update the hasAssigned flag for the previously assigned group (if any)
      if (prevAssignedGroup) {
        prevAssignedGroup.hasAssigned = false;
        await axios.put(
          `http://localhost:5000/api/v1/groups/${prevAssignedGroup._id}/status`,
          prevAssignedGroup
        );
      }

      // Update the hasAssigned flag for the newly assigned group (if any)
      if (newAssignedGroup) {
        newAssignedGroup.hasAssigned = true;
        await axios.put(
          `http://localhost:5000/api/v1/groups/${newAssignedGroup._id}/status`,
          newAssignedGroup
        );
      }

      // Update the exam details
      await axios.put(`http://localhost:5000/api/v1/update/exam/${id}`, exam);

      toast.success("Exam edited successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        className: "mt-10",
      });

      setTimeout(() => {
        navigate("/exam/add");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container pl-8 pr-6 mx-auto pt-6">
        <div className="flex relative justify-end items-center">
          <NavLink to="/exam/add">
            <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-md">
              <ViewListIcon className="h-5 w-5" />
              <h1 className="font-bold py-1">LIST</h1>
            </button>
          </NavLink>
        </div>

        <form className="mt-4 px-4 py-4 shadow-top shadow-left shadow-right shadow-bottom bg-white border border-blue rounded-lg">
          <h1 className="mb-4 font-bold text-gray-600">EDIT EXAM</h1>

          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label
                htmlFor="examName"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                EXAM NAME
              </label>

              <input
                type="text"
                id="examName"
                name="examName"
                value={exam.examName}
                onChange={onValueChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4 w-1/2">
              <label
                htmlFor="assignment"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                ASSIGNMENT
              </label>

              <select
                id="assignment"
                name="assignment"
                value={exam.assignment}
                onChange={onValueChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {groupNames.map((groupName) => (
                  <option key={groupName._id} value={groupName._id}>
                    {groupName.groupname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label
                htmlFor="questionSetName"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                QUESTION SET NAME
              </label>

              <select
                id="questionSetName"
                name="questionSetName"
                value={exam.questionSetName}
                onChange={onValueChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {questionSetNames.map((questionSet, index) => (
                  <option key={index} value={questionSet._id}>
                    {questionSet.questionSetName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 w-1/2">
              <label
                htmlFor="negativeMarks"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                NEGATIVE MARKS
              </label>

              <select
                id="negativeMarks"
                name="negativeMarks"
                value={exam.negativeMarks}
                onChange={onValueChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="N/A">N/A</option>

                <option value="0.25">0.25</option>
              </select>
            </div>
          </div>

          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label
                htmlFor="examDuration"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                EXAM DURATION
              </label>

              <input
                type="number"
                id="examDuration"
                name="examDuration"
                value={exam.examDuration}
                onChange={onValueChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="Enter exam duration (e.g., 30:00 min or 01:00 hr)"
              />
            </div>

            <div className="mb-4 w-1/2">
              <label
                htmlFor="examDateTime"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                EXAM DATE &amp; TIME
              </label>

              <input
                type="datetime-local"
                id="examDateTime"
                name="examDateTime"
                value={exam.examDateTime}
                onChange={onValueChange}
                className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={updateExamDetails}
              className="w-full font-bold px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Edit Exam
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditExam;
