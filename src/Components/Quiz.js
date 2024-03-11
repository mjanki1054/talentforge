import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [previousAnswers, setPreviousAnswers] = useState({});
  const [hasCompletedExam, sethasCompletedExam] = useState(false);

  const navigate = useNavigate();
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
        const response = await fetch('http://localhost:3080/api/v1/examstatus/${userId}', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ hasCompletedExam: true, score: score, hasBeenTerminated: true })
        });

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

    const token = localStorage.getItem('token');
    const topic = localStorage.getItem('topic');
    const duration = localStorage.getItem('duration');
    const numofques = localStorage.getItem('numofques');
    const hasCompletedExam = JSON.parse(localStorage.getItem('hasCompletedExam'));
    console.log("hasCompletedExam", hasCompletedExam);
    console.log("duration", duration)
    // const examduration=duration*60*1000;
    const time = localStorage.getItem('datetime');
    console.log("time", time)
    const StartTime = new Date(Date.parse(time));
    const examStartTime = StartTime.getTime();
    console.log("examStartTime", examStartTime)
    // const examEndTime=examStartTime+examduration;
    const currentTime = new Date();
    console.log("currentTime", currentTime)
    const elapsedSeconds = Math.floor((currentTime - examStartTime) / 1000);
    console.log("elapsedSeconds", elapsedSeconds)
    const remainingSeconds = duration * 60 - elapsedSeconds;
    console.log("remainingSeconds", remainingSeconds)

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
      async function fetchQuestions() {
        const response = await fetch('http://localhost:3080', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ prompt: `Please generate ${numofques} multiple choice questions on topic ${topic}, separated by a blank line. Each question should start with 'Q:' and have 4 answer options (A, B, C, D). Indicate the correct answer at the end of each question with 'Answer: [option]'.` })
        });

        const data = await response.json();

        // Extract questions and options from the API response
        const parts = data.choices[0].text.split('\n');
        const extractedQuestions = parts
          .filter((part) => part.startsWith('Q:'))
          .map((questionText) => {
            const optionsStartIndex = parts.indexOf(questionText) + 1;
            console.log('optionsStartIndex:', optionsStartIndex);
            const optionsEndIndex = optionsStartIndex + 5;
            console.log('optionsEndIndex:', optionsEndIndex);
            const correctAnswer = parts[optionsEndIndex - 1].substring(8, 9);
            console.log('correctAnswer:', correctAnswer);
            return {
              text: questionText.substring(3).trim(),
              options: parts.slice(optionsStartIndex, optionsEndIndex - 1).map((optionText) => optionText.substring(3).trim()),
              correctIndex: (correctAnswer.charCodeAt(0) - 65 + 1) - 1,
            };
          });

        setQuestions(extractedQuestions);
        setOptions(extractedQuestions[0].options);
        setIsLoading(false);
        //setRemainingTime(duration * 60); // Set the remaining time in seconds
        setRemainingTime(remainingSeconds);
      }

      fetchQuestions();
    }
  }, [navigate]);

  useEffect(() => {
    // Decrement remaining time every second
    const intervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);
    if (remainingTime <= 0 && questions.length) {
      clearInterval(intervalId);
      alert("Time is UP")
      setCurrentQuestionIndex(questions.length);
      try {
        const response = fetch('http://localhost:3080/api/v1/examstatus/${userId}', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          //body: JSON.stringify({ userId: user.id, hasCompletedExam: true })
          body: JSON.stringify({ hasCompletedExam: true, score: score })

        });

        const data = response.json();
        console.log(data.message); // Log the response message
      } catch (error) {
        console.error(error);
      }
    }
    return () => clearInterval(intervalId);

  }, [remainingTime, questions.length]);

  const handleOptionSelected = (questionIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  const saveHandler = () => {
    // get current question and user answer
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];

    // check if user has selected an answer
    if (userAnswer !== undefined) {
      // check if user's answer is correct
      if (userAnswer === currentQuestion.correctIndex) {
        // check if the current question has already been answered
        if (answeredQuestions.includes(currentQuestionIndex)) {
          // check if the answer has changed from the previous one
          if (userAnswer !== previousAnswers[currentQuestionIndex]) {
            setScore(score + 1);
            previousAnswers[currentQuestionIndex] = userAnswer;
          }
        } else {
          setScore(score + 1);
          previousAnswers[currentQuestionIndex] = userAnswer;
          answeredQuestions.push(currentQuestionIndex);
        }
        console.log("Answer is correct!");
      } else {
        console.log("Answer is incorrect.");
        // check if the current question has already been answered
        if (answeredQuestions.includes(currentQuestionIndex)) {
          // check if the answer has changed from the previous one
          if (userAnswer !== previousAnswers[currentQuestionIndex]) {
            setScore(score - 1);
            previousAnswers[currentQuestionIndex] = userAnswer;
          }
        } else {
          previousAnswers[currentQuestionIndex] = userAnswer;
          answeredQuestions.push(currentQuestionIndex);
        }
      }
    } else {
      console.log("User has not selected an answer.");
    }

    // move to the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);

    // check if there are more questions to display
    if (questions.length > currentQuestionIndex + 1) {
      setOptions(questions[currentQuestionIndex + 1].options);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex);
      setOptions(questions[currentQuestionIndex].options);
    }
  };
  const token = localStorage.getItem('token');
  //const user = JSON.parse(localStorage.getItem('user'));

  const SubmitHandler = async () => {
    setCurrentQuestionIndex(questions.length);
    sethasCompletedExam(true);

    try {
      const response = await fetch('http://localhost:3080/api/v1/examstatus/${userId}', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        //body: JSON.stringify({ userId: user.id, hasCompletedExam: true })
        body: JSON.stringify({ hasCompletedExam: true, score: score })

      });

      const data = await response.json();
      console.log(data.message); // Log the response message
      localStorage.setItem('hasCompletedExam',true)
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (

    <div>

      {isLoading && <h3>Loading quiz questions...</h3>}
      {!isLoading && questions.length > 0 && !hasCompletedExam && currentQuestionIndex < questions.length && (
        <div>
          <p className="font-bold float-right mt-3 text-2xl pr-4">
            Time left: {Math.floor(remainingTime / 60)} minute{Math.floor(remainingTime / 60) !== 1 && 's'} {remainingTime % 60} second{remainingTime % 60 !== 1 && 's'}
          </p>
          <div className='w-full h-screen flex justify-center items-center'>
            <div className='w-[40%] border shadow-lg rounded-md overflow-hidden'>
              <div className='p-3 text-3xl'>{currentQuestionIndex + 1}.{questions[currentQuestionIndex].text}</div>

              {options.map((option, index) => (
                <div key={index} className={`p-3 border hover:bg-blue-400 hover:text-white duration-200 cursor-pointer`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    id={`question-${currentQuestionIndex}-option-${index}`}
                    value={index}
                    onChange={() => handleOptionSelected(currentQuestionIndex, index)}
                    checked={userAnswers[currentQuestionIndex] === index}
                  /> <label htmlFor={`question-${currentQuestionIndex}-option-${index}`}>{option}</label>
                  {userAnswers[currentQuestionIndex] === index && (
                    <button className="ml-2" onClick={() => handleOptionSelected(currentQuestionIndex, null)}>
                      Clear selection
                    </button>
                  )}
                </div>
              ))}
              <div className='flex justify-between'>
                {currentQuestionIndex > 0 && (
                  <button className='cursor-pointer h-[40px] px-3 bg-blue-500 text-white' onClick={() => {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    setOptions(questions[currentQuestionIndex - 1].options);
                  }}>
                    Previous
                  </button>
                )}
                <div className='cursor-pointer h-[40px] px-3 bg-green-500 text-white' onClick={saveHandler}>Save & Next</div>
                <div className='cursor-pointer h-[40px] px-3 bg-red-500 text-white' onClick={SubmitHandler}>Submit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (currentQuestionIndex === questions.length || remainingTime <= 0) && (

        <div className='w-full h-screen flex justify-center items-center'>
          <div className='w-[40%] border shadow-lg rounded-md overflow-hidden text-center'>
            <h2 className='text-2xl p-3 my-2'>Your score is {score} out of {questions.length}</h2>
            <button onClick={handleLogout} class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 mt-7">
              Logout
            </button>
          </div>
        </div>
      )}
      {/* render a message to the user if the quiz has been completed or the quiz questions cannot be rendered */}
      {(hasCompletedExam || (questions.length === 0 && !isLoading)) && (
        <div>
          <h3>The quiz has already been completed or the questions cannot be loaded. Please try again later.</h3>
        </div>
      )}
    </div>
  );

};

export default Quiz;





 //'Please generate 3 multiple choice quiz computer questions and answer options.
 //Each question should have 4 answer options (A, B, C, D) and the correct answer should be indicated at the end with Answer: [option]. Thank you!       