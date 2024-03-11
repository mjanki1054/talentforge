import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListExam from "./ListExam";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
const initialValue = {
  examName: "",
  assignment: "",
  questionSetName: "",
  negativeMarks: "",
  examDuration: "",
  examDateTime: "",
};
const AddExam = () => {
  const [exam, setExam] = useState(initialValue);
  const [groupNames, setGroupNames] = useState([]);
  const [questionSetNames, setQuestionSetNames] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch group names and question set names from the API endpoints
    fetchGroupNames();
    fetchQuestionSetNames();
  }, []);

  const fetchGroupNames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/groups");
      const data = response.data;
      console.log("group", data);
      // Filter the groups based on the hasAssigned flag
      const unassignedGroups = data.groups.filter(
        (group) => !group.hasAssigned
      );
      setGroupNames(unassignedGroups);
      setExam({ ...exam, assignment: unassignedGroups[0]?._id || "" });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestionSetNames = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/questionset"
      );
      const data = response.data;
      console.log("set", data);
      setQuestionSetNames(data);
      if (data && data.questionSets && data.questionSets.length > 0) {
        setExam({ ...exam, questionSetName: data.questionSets[0]._id });
      } else {
        setExam({ ...exam, questionSetName: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onValueChange = (e) => {
    const { name, value } = e.target;
    setExam({ ...exam, [name]: value });
  };

  const addExamDetails = async (event) => {
    event.preventDefault();
    // Format the examDateTime value
    const formattedExamDateTime = new Date(exam.examDateTime).toISOString();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/create/exam",
        {
          ...exam,
          assignment: [exam.assignment], // Convert assignment to an array with a single value
          questionSetName: [exam.questionSetName],
          examDateTime: formattedExamDateTime,
        }
      );
      setTimeout(() => {
        setStatus(true);
      }, 1000);

      setTimeout(() => {
        setShowMessage(false);
      }, 1000);

      console.log(response.data, "get response");
      setExam(initialValue);
      setSubmitted(true);
      setShowMessage(true);
      // Set hasAssigned flag to true for the selected group
      const selectedGroup = groupNames.find(
        (group) => group._id === exam.assignment
      );
      if (selectedGroup) {
        const updatedGroup = { ...selectedGroup, hasAssigned: true };
        await axios.put(
          `http://localhost:5000/api/v1/groups/${selectedGroup._id}/status`,
          updatedGroup
        );
      }
    } catch (error) {
      console.log(error);
    }
    navigate("/exam/add");
  };
  const clearForm = () => {
    setExam(initialValue);
  };
  if (status) {
    return <AddExam />;
  }

  return (
    <>
      <div className="container mb-[60px] ">
        <div className="container pl-8 pr-6 mx-auto pt-6">
          <form className="bg-white px-2 pt-4 rounded-md mt-2 px-6 shadow-lg pb-4">
            <div className="flex items-center">
              <div className="mb-4">
                <p className="pb-4 font-bold text-gray-600">ADD NEW EXAM</p>
              </div>

              <div className="flex justify-center flex-grow">
                {submitted && showMessage && (
                  <div className="bg-blue-100 shadow-lg rounded-md p-2 mb-4 inline-flex items-center mr-20 fixed top-20">
                    <p className="text-green-700 text-center text-md">
                      <TaskAltSharpIcon
                        className="mr-2"
                        style={{ color: "green" }}
                      />
                      Form Submitted Successfully
                    </p>
                  </div>
                )}
              </div>
            </div>

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
                  value={exam.groupname}
                  onChange={onValueChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select Group Name</option>

                  {groupNames.map((groupName, index) => (
                    <option key={index} value={groupName._id}>
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
                  <option value="">Select Question Set Name</option>

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
                  <option value="">Select Negative Marks</option>

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
                  EXAM DURATION (min)
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                onClick={(e) => {
                  addExamDetails(e);

                  setShowMessage(true); // Show the message on submit button click
                }}
                className="px-4 py-2 mt-2 mb-6 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>

              <button
                type="reset"
                onClick={() => {
                  setExam(initialValue);
                }}
                className="ml-6 px-4 py-2 rounded-md text-white bg-gray-400 hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <ListExam />
      </div>
    </>
  );
};

export default AddExam;