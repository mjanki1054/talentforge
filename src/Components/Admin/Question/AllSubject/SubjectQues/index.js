import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const SubjectPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { subjectName, id, questionNumber } = useParams();
  const [checkedCount, setCheckedCount] = useState(0); // Track the count of checked checkboxes
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/question",
          {
            prompt: `Please generate 10 MCA, B-Tech level 1 multiple choice question on ${subjectName}, separated by a blank line. Each question should start with 'Q:' and have 4 answer options (A, B, C, D). Indicate the correct answer at the end of each question with 'Answer: [option]'.`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        const parts = data.choices[0].text.split("\n");
        const extractedQuestions = parts
          .filter((part) => part.startsWith("Q:"))
          .map((questionText) => {
            const optionsStartIndex = parts.indexOf(questionText) + 1;
            const optionsEndIndex = optionsStartIndex + 5;
            const correctAnswer = parts[optionsEndIndex - 1].substring(8, 9);

            return {
              text: questionText.substring(3).trim(),
              options: parts
                .slice(optionsStartIndex, optionsEndIndex - 1)
                .map((optionText) => optionText),
              correctIndex: correctAnswer.charCodeAt(0) - 65,
              isSelected: false, // Add isSelected property to track checkbox selection
            };
          });

        setQuestions(extractedQuestions);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectName]);

  const handleFormSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        questions: questions
          .filter((question) => question.isSelected)
          .map((question) => ({
            question: question.text,
            options: question.options,
            correctAnswer: String.fromCharCode(question.correctIndex + 65),
          })),
      };

      const response = await axios.post(
        `http://localhost:5000/api/v1/questioncreate/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data, "apt.js"); // You can handle the response as per your requirements

      // Reset checkedCount and disable all checkboxes after form submission
      setCheckedCount(0);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) => ({ ...question, isSelected: false }))
      );
      toast.success("Added Questions successfully!", {
        position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
        autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
        className: "mt-10",
      });
      setTimeout(() => {
        navigate(`/questionset/subjects/${id}`);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (index, isChecked) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].isSelected = isChecked;

      // Update checkedCount based on checkbox state
      if (isChecked) {
        setCheckedCount((prevCount) => prevCount + 1);
      } else {
        setCheckedCount((prevCount) => prevCount - 1);
      }

      return updatedQuestions;
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto px-40 pt-10 pb-10">
        <div className="flex relative justify-between items-center">
          <h1 className="m-2 font-bold items-center">{subjectName}</h1>
          {checkedCount !== questions.length && (
            <NavLink to={`/questionset/subject/${subjectName}/add/${id}`}>
              <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-md">
                <h1 className="font-bold ml-2 py-1">Add Question</h1>
              </button>
            </NavLink>
          )}
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="px-4 py-2">Question No.</th>
              <th className="px-4 py-2">Questions</th>
              <th className="px-4 py-2">Options</th>
              <th className="px-4 py-2">Correct Answer</th>
              <th className="px-4 py-2">Select</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-blue-500">Loading...</span>
                </td>
              </tr>
            ) : (
              questions.map((question, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-xs text-left">
                    {question.text}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {question.options.map((option, optionIndex) => (
                      <tr key={optionIndex} className="text-xs">
                        {option}
                      </tr>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {String.fromCharCode(question.correctIndex + 65)}
                  </td>
                  <td className="px-4 py-2 items-center">
                    <input
                      type="checkbox"
                      className="p-2 h-4 w-4 bg-cyan-600 rounded-xl"
                      checked={question.isSelected}
                      onChange={(e) =>
                        handleCheckboxChange(index, e.target.checked)
                      }
                      disabled={checkedCount === questions.length} // Disable checkboxes when checkedCount reaches the total number of questions
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="my-4 pb-10">
          <button
            type="button"
            className="w-full font-bold px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={handleFormSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default SubjectPage;