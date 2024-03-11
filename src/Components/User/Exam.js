import React, { useState, useEffect } from "react";

import { NavLink, useNavigate } from "react-router-dom";

const Exam = () => {
  // const navigate = useNavigate();

  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [paletteColors, setPaletteColors] = useState([]);

  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [questions, setQuestions] = useState([]);

  const [score, setScore] = useState(0);

  const [remainingTime, setRemainingTime] = useState(0);

  const [hasCompletedExam, sethasCompletedExam] = useState(false);

  const [previouslySelectedOptions, setPreviouslySelectedOptions] = useState(
    []
  );

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  useEffect(() => {
    // Add event listeners for the visibilitychange and blur events

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("User switched away from the quiz tab");

        navigate("/");

        saveExamStatus();
      }
    };

    const handleBlur = () => {
      console.log("User switched away from the quiz tab");

      navigate("/");

      saveExamStatus();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("blur", handleBlur);

    const saveExamStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/examstatus/${email}",
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              hasCompletedExam: true,
              score: score,
              hasBeenTerminated: true,
            }),
          }
        );

        const data = await response.json();

        console.log(data.message); // Log the response message
      } catch (error) {
        console.error(error);
      }
    };

    return () => {
      // Remove event listeners for the visibilitychange and blur events

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("blur", handleBlur);
    };
  }, [navigate, score]);

  useEffect(() => {
    const hasCompletedExam = JSON.parse(
      localStorage.getItem("hasCompletedExam")
    );

    if (hasCompletedExam) {
      // Redirect the user to the home page if the exam has been completed

      console.log("Redirecting to home page");

      navigate("/");

      return;
    }

    if (!token) {
      // Redirect the user to the login page if the token is not present

      navigate("/");

      return;
    } else {
      // Fetch the question set details from the API

      const fetchQuestionSet = async () => {
        try {
          const token = localStorage.getItem("token");

          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          const response = await fetch(
            "http://localhost:5000/api/v1/dashboard/user/details/${email}",

            config
          );

          const data = await response.json();

          const duration = data.Duration;

          const examTime = data.examDateTime;

          localStorage.setItem("examDateTime", examTime);

          localStorage.setItem("Duration", duration);

          const startTime = new Date(Date.parse(examTime));

          const currentTime = new Date();

          const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

          const remainingSeconds = duration * 60 - elapsedSeconds;

          setRemainingTime(remainingSeconds);

          // Extract the questions from the API response

          const questionsData = data.questionSetName[0].questions;

          // Generate a random seed

          const seed = Math.random();

          // Shuffle the questions array using the seed

          const shuffledQuestions = shuffleArray(questionsData, seed);

          setQuestions(shuffledQuestions);

          // Initialize the state values based on the number of questions

          const initialSelectedOptions = Array(shuffledQuestions.length).fill(
            null
          );

          const initialPaletteColors = Array(shuffledQuestions.length).fill(
            "gray-300"
          );

          setSelectedOptions(initialSelectedOptions);

          setPaletteColors(initialPaletteColors);
        } catch (error) {
          console.error("Error fetching question set:", error);
        }
      };

      fetchQuestionSet();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);

    if (remainingTime <= 0 && questions.length) {
      clearInterval(intervalId);

      alert("Time is UP");

      // Submit the exam and update the exam status

      submitExam();

      navigate("/result");
    }

    return () => clearInterval(intervalId);
  }, [remainingTime, questions.length, score]);

  const calculateScore = (selectedOptions) => {
    let newScore = 0;

    for (let i = 0; i < selectedOptions.length; i++) {
      const selectedOptionIndex = selectedOptions[i];

      const correctAnswer = questions[i].correctAnswer;

      if (selectedOptionIndex !== null) {
        const selectedOptionPrefix = String.fromCharCode(
          65 + selectedOptionIndex
        );

        const isCorrect =
          selectedOptionPrefix.trim().toUpperCase() ===
          correctAnswer.trim().toUpperCase();

        if (isCorrect) {
          newScore++;
        }
      }
    }

    return newScore;
  };

  const handleQuestionButtonClick = (questionNumber) => {
    const newPaletteColors = [...paletteColors];

    // Calculate the score for the current question based on the newly selected options

    const currentSelectedOptions = selectedOptions[currentQuestion];

    const newSelectedOptions = [...selectedOptions];

    newSelectedOptions[currentQuestion] = currentSelectedOptions;

    const newScore = calculateScore(newSelectedOptions);

    setScore(newScore);

    if (!answeredQuestions.includes(currentQuestion)) {
      newPaletteColors[currentQuestion] = "red-500";
    }

    setCurrentQuestion(questionNumber);

    if (!answeredQuestions.includes(questionNumber)) {
      setAnsweredQuestions([...answeredQuestions, questionNumber]);
    }

    setPaletteColors(newPaletteColors);
  };

  const token = localStorage.getItem("token");

  const submitExam = async () => {
    const newScore = calculateScore(selectedOptions);

    setScore(newScore);

    console.log("Score calculated:", newScore);

    // Update the exam status and navigate to the result page

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/examstatus/${email}",

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({ hasCompletedExam: true, score: newScore }),
        }
      );

      const data = await response.json();

      console.log(data.message); // Log the response message

      localStorage.setItem("hasCompletedExam", true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveAndNext = () => {
    const newPaletteColors = [...paletteColors];

    const isQuestionAnswered = selectedOptions[currentQuestion] !== null;

    if (!answeredQuestions.includes(currentQuestion) && !isQuestionAnswered) {
      newPaletteColors[currentQuestion] = "red-500";
    } else {
      newPaletteColors[currentQuestion] = "green-500";

      if (!answeredQuestions.includes(currentQuestion)) {
        setAnsweredQuestions([...answeredQuestions, currentQuestion]);
      }

      submitExam();
    }

    setPaletteColors(newPaletteColors);

    if (currentQuestion === questions.length - 1) {
      // Check if it's the last question

      if (!answeredQuestions.includes(currentQuestion)) {
        setAnsweredQuestions([...answeredQuestions, currentQuestion]);
      }

      sethasCompletedExam(true);

      return;
    }

    setCurrentQuestion(currentQuestion + 1);
  };

  const handleOptionChange = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];

    const isOptionSelected =
      newSelectedOptions[currentQuestion] === optionIndex;

    if (isOptionSelected) {
      // If the same option is clicked again, unselect it

      newSelectedOptions[currentQuestion] = null;
    } else {
      // Select the new option

      newSelectedOptions[currentQuestion] = optionIndex;
    }

    setSelectedOptions(newSelectedOptions);
  };

  if (questions.length === 0) {
    // Loading state while fetching the question set

    return <div>Loading...</div>;
  }

  const currentQuestionObj = questions[currentQuestion];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white py-4">
        <h1 className="text-2xl font-bold text-center">NCAT Online Exam</h1>
      </header>

      <main className="flex flex-row flex-grow ">
        <div className="w-3/4 bg-gray-100 p-4">
          <h2 className="text-lg font-bold">
            Current question: {currentQuestion + 1}
          </h2>

          <div className="justify-center border shadow-lg border-gray-300 rounded-lg py-4">
            <div className="mb-4 mx-2">{currentQuestionObj.question}</div>

            <div>
              {currentQuestionObj.options.map((option, index) => (
                <label
                  className={`block mb-2 border-b ${
                    selectedOptions[currentQuestion] === index
                      ? "bg-gray-300"
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    const isOptionSelected =
                      selectedOptions[currentQuestion] === index;

                    if (isOptionSelected) {
                      handleOptionChange(null); // Unselect the option if it is already selected
                    } else {
                      handleOptionChange(index); // Otherwise, select or change the option
                    }
                  }}
                  onDoubleClick={() => handleOptionChange(null)} // Double-click to unselect the option
                >
                  <input
                    type="radio"
                    name={`option${currentQuestion}`}
                    value={`option${index + 1}`}
                    className="mx-2"
                    checked={selectedOptions[currentQuestion] === index}
                    onChange={() => {}}
                  />

                  {option}
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-between mx-4">
              <button
                className="bg-green-700 hover:bg-blue-700 text-white py-2 px-4 mr-4"
                disabled={currentQuestion === 0}
                onClick={() => handleQuestionButtonClick(currentQuestion - 1)}
              >
                Previous
              </button>

              <button
                className="bg-gradient-to-b from-teal-300 to-teal-800 hover:bg-blue-700 text-white py-2 px-4 mr-4"
                onClick={handleSaveAndNext}
              >
                Save and Next
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/4 bg-gradient-to-b from-teal-300 to-teal-800 px-4 py-2">
          <div className="border rounded shadow-md p-4">
            <p className="font-bold">
              Time left: {Math.floor(remainingTime / 60)} minute
              {Math.floor(remainingTime / 60) !== 1 && "s"} {remainingTime % 60}{" "}
              second{remainingTime % 60 !== 1 && "s"}
            </p>
          </div>

          <div className="border rounded shadow-md px-4 pb-4 pt-1 mt-4">
            <h3 className="font-bold">Question Palette</h3>

            <div
              className="overflow-y-scroll mt-4"
              style={{ maxHeight: "calc(100vh - 400px)" }}
            >
              <div className="grid grid-cols-4 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handleQuestionButtonClick(index)}
                  >
                    <div
                      className={`${
                        currentQuestion === index
                          ? "bg-blue-500"
                          : `bg-${paletteColors[index]}`
                      } rounded p-2 text-center`}
                    >
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <h3 className="font-bold">Legend</h3>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500"></div>

              <span className="ml-2 font-bold">Attempted</span>
            </div>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500"></div>

              <span className="ml-2 font-bold">Current</span>
            </div>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500"></div>

              <span className="ml-2 font-bold">Unattempted</span>
            </div>

            <NavLink to="/result">
              <button
                onClick={submitExam}
                className=" mt-2 bg-red-600 hover:bg-blue-700 text-white py-2 px-4"
              >
                Submit
              </button>
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Exam;
