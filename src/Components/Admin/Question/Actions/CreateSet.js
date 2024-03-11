import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SetList from "./SetList";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const CreateSet = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [subjectInputs, setSubjectInputs] = useState({});
  const [totalQuestions, setTotalQuestions] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [questionSetName, setQuestionSetName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState();
  const [errors, setErrors] = useState({});
  const [questionSetNameError, setQuestionSetNameError] = useState("");
  const [totalQuestionsError, setTotalQuestionsError] = useState("");
  const [subjectNameError, setSubjectNameError] = useState("");

  const navigate = useNavigate();

  useEffect(() => { }, []);

  const togglePopup = async () => {
    // Validate the form
    if (showPopup && !validateForm()) {
      return;
    }

    if (!showPopup) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/all/subject"
        );
        setSubjects(response.data.subjects);
      } catch (error) {
        console.log("Error:", error);
      }
    }

    if (showPopup) {
      const sum = Object.values(subjectInputs)
        .map((value) => parseInt(value))
        .filter((value) => !isNaN(value))
        .reduce((total, value) => total + value, 0);
      setTotalQuestions(sum.toString());
    }
    setShowPopup(!showPopup);

    // Set subjectName based on selected subjects
    const selectedSubjects = subjects.filter(
      (subject, index) => subjectInputs[index]
    );
    const selectedSubjectNames = selectedSubjects.map((subject, index) => {
      const questionNo = subjectInputs[index]
        ? ` (${subjectInputs[index]})`
        : "";
      return subject.subjectName + questionNo;
    });

    // Set questionNo based on the selected subjects
    const questionNumbers = {};
    selectedSubjects.forEach((subject, index) => {
      const questionNo = subjectInputs[index];
      if (questionNo) {
        questionNumbers[subject._id] = questionNo;
      }
    });
    setSubjectName(selectedSubjectNames.join(", "));
  };

  const addSetDetails = async () => {
    // Check if any subject input is empty
    const newErrors = {};
    subjects.forEach((subject, index) => {
      if (!subjectInputs[index]) {
        newErrors[index] = "Please enter a value";
      }
    });
    setErrors(newErrors);

    // Return false if any required field is empty
    if (
      !questionSetName ||
      !totalQuestions ||
      Object.keys(newErrors).length > 0
    ) {
      toast.error("Please fill all the values!", {
        position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
        autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
        className: "mt-10",
      });
      return;
    }
    try {
      const subjectArray = subjects
        .filter((subject, index) => subjectInputs[index])
        .map((subject) => subject._id);

      const questionNumbers = Object.values(subjectInputs)
        .map((value) => parseInt(value))
        .filter((value) => !isNaN(value));

      const data = {
        questionSetName,
        totalQuestions,
        subject: subjectArray,
        questionNo: questionNumbers,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/question/creates",
        data
      );
      setTimeout(() => {
        setStatus(true);
      }, 1000);

      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
      if (response.status === 200) {
        console.log(response.data);
        setSubmitted(true);
        setShowMessage(true);
        navigate("/questionset/add");
      } else {
        console.log("Error:", response.data.error);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if any subject input is empty
    subjects.forEach((subject, index) => {
      if (!subjectInputs[index]) {
        newErrors[index] = "Please enter a value";
      }
    });

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const clearSubjectDetails = (e) => {
    e.preventDefault();
    setShowPopup(!showPopup);
    setErrors({});
  };

  const resetForm = () => {
    setQuestionSetName("");
    setTotalQuestions("");
    setSubjectName("");
    setSubjectInputs({});
    setQuestionSetNameError("");
    setTotalQuestionsError("");
    setSubjectNameError("");
    setErrors({});
  };

  const handleQuestionSetNameChange = (e) => {
    const value = e.target.value.trim();
    setQuestionSetName(value);

    if (value === "") {
      // Clear the error message if the input is empty
      setQuestionSetNameError("");
    } else {
      // Regular expression to check if the value matches the format "SET A"
      const regex = /^SET [A-Z]$/;
      const isValid = regex.test(value);

      // Update the error message based on whether the input is valid or not
      setQuestionSetNameError(
        isValid ? "" : "Question Set Name must be in the format 'SET A'"
      );
    }
  };

  const handleSubjectInputChange = (subjectId, value) => {
    const parsedValue = parseInt(value, 10); // Parse the input value to an integer
    const isValidNumber = !isNaN(parsedValue) && parsedValue > 0;

    setSubjectInputs((prevSubjectInputs) => ({
      ...prevSubjectInputs,
      [subjectId]: value,
    }));

    // Update the error message based on the validity of the input
    if (!isValidNumber && value !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [subjectId]: "Please enter a valid number",
      }));
    } else {
      // Clear the error message if the input is valid or empty
      setErrors((prevErrors) => ({
        ...prevErrors,
        [subjectId]: "",
      }));
    }
  };

  if (status) {
    return <CreateSet />;
  }

  return (
    <>
      <ToastContainer />
      <div className="container mb-[60px] ">
        <div className="container pl-8 pr-6 mx-auto pt-6">
          <form className="bg-white pb-4 px-2 pt-4 rounded-md mt-2 px-6 shadow-lg">
            <div className="flex items-center">
              <div className="mb-4">
                <p className="pb-4 font-bold text-gray-600">ADD QUESTION SET</p>
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
              <div className="mb-4 w-1/2 mr-4 ">
                <label
                  htmlFor="questionsetname"
                  className="block mb-1 font-medium text-gray-600 text-sm"
                >
                  QUESTION SET NAME
                </label>
                <input
                  type="text"
                  id="questionsetname"
                  name="questionsetname"
                  className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 ${questionSetNameError ? "ring-red-500" : "ring-blue-600"
                    }`}
                  value={questionSetName}
                  onChange={handleQuestionSetNameChange}
                />
                {questionSetNameError && (
                  <p className="text-red-500">{questionSetNameError}</p>
                )}
              </div>
              <div className="mb-4 w-1/2">
                <label
                  htmlFor="totalquestions"
                  className="block mb-1 font-medium text-gray-600 text-sm"
                >
                  TOTAL QUESTIONS
                </label>
                <input
                  type="text"
                  id="totalquestions"
                  name="totalquestions"
                  className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring ${totalQuestionsError ? "ring-red-500" : "ring-blue-600"
                    }`}
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  disabled
                />
                {totalQuestionsError && (
                  <p className="text-red-500">{totalQuestionsError}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="candidates"
                className="block mb-1 font-medium text-gray-600 text-sm"
              >
                SUBJECTS NAME
              </label>
              <textarea
                id="candidates"
                name="candidates"
                disabled
                value={subjectName}
                className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none ${subjectNameError ? "ring-red-500" : "ring-blue-400"
                  }`}
              />
              {subjectNameError && (
                <p className="text-red-500">{subjectNameError}</p>
              )}
            </div>

            <button
              type="button"
              className="w-1/2 font-bold px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md mb-4"
              onClick={togglePopup}
            >
              Subjects
            </button>
            {showPopup && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Subject</th>
                        <th className="px-4 py-2">Question number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">
                            {subject.subjectName}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="border px-4 py-2"
                              value={subjectInputs[index] || ""}
                              onChange={(e) =>
                                handleSubjectInputChange(index, e.target.value)
                              }
                            />
                            {errors[index] && (
                              <p className="text-red-500">{errors[index]}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex mb-4">
                    <button
                      className="mt-4 font-bold px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
                      onClick={(e) => {
                        e.preventDefault();
                        togglePopup();
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="ml-40 mt-4 font-bold px-6 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md"
                      onClick={clearSubjectDetails}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-4">
              <button
                type="button"
                onClick={(e) => {
                  addSetDetails(e);
                  setShowMessage(true); // Show the message on submit button click
                }}
                className="px-4 py-2 mt-2 mb-6 rounded-md text-white bg-blue-500 hover:bg-blue-600"
              >
                Add Set
              </button>
              <button
                type="reset"
                onClick={() => {
                  resetForm();
                }}
                className="ml-6 px-4 py-2 rounded-md text-white bg-gray-400 hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <SetList />
      </div>
    </>
  );
};

export default CreateSet;
