import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import profile from "../../logo/profile.png";

function User() {
  const [user, setUser] = useState({});

  const [exam, setExam] = useState({});

  const [isQuizEnabled, setIsQuizEnabled] = useState(false);

  const [countdown, setCountdown] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios

      .get(
        "http://localhost:5000/api/v1/dashboard/user/details/${email}",

        config
      )

      .then((response) => {
        const { data } = response;

        console.log(response, "................");

        setExam(data);

        setUser(data.user);

        const hasCompletedExam = data.user.hasCompletedExam; // Access hasCompletedExam from the response data

        localStorage.setItem("hasCompletedExam", hasCompletedExam.toString());

        console.log("hasCompletedExam.User", hasCompletedExam);
      })

      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const userDateTime = new Date(Date.parse(exam.examDateTime));

    const userTimestamp = userDateTime.getTime(); // convert userDateTime to Unix timestamp

    const now = new Date();

    const currentTimestamp = now.getTime(); // get current Unix timestamp(ms)

    // Calculate the time difference in milliseconds

    const timeDiff = userTimestamp - currentTimestamp;

    // Enable the quiz if the specified start time has already passed

    if (Math.abs(timeDiff) <= 900000 && timeDiff < 0) {
      // Check if user is up to 15 minutes late

      setIsQuizEnabled(true);
    } else {
      setIsQuizEnabled(false);

      // Start a countdown timer if the quiz has not yet started, before 15 min or within 15 min

      let timer;

      if (timeDiff > 0 && timeDiff <= 900000) {
        setCountdown(timeDiff);

        timer = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 0) {
              clearInterval(timer);
              setIsQuizEnabled(true);
              return null;
            } else {
              return prevCountdown - 1000;
            }
          });
        }, 1000);
      }

      return () => clearInterval(timer);
    }
  }, [user]);

  const handleStartQuiz = () => {
    navigate("/instruction");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  const formatExamDateTime = () => {
    const examDateTime = new Date(exam.examDateTime);

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

    const formattedDate = examDateTime.toLocaleDateString(
      undefined,

      dateOptions
    );

    const formattedTime = examDateTime.toLocaleTimeString(
      undefined,

      timeOptions
    );

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatExamDateTime();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-20">
      <div className="bg-white rounded-lg shadow-2xl w-full sm:w-1/2 relative animate-fade-in-down">
        <div className="flex flex-wrap p-8">
          <div className="w-full sm:w-1/3 bg-gradient-to-b from-blue-200 to-blue-400 rounded-l-md">
            <div className="p-4 text-center text-white">
              <div className="mb-6">
                <img
                  src={profile}
                  className="rounded-full h-32 w-32 mx-auto mt-10 object-cover"
                  alt="Profile"
                />
              </div>

              <h6 className="font-semibold text-lg">{user.name}</h6>

              <p className="mb-1 text-xs font-semibold uppercase">
                {user.email}
              </p>

              <i className="feather icon-edit mt-4 text-lg"></i>
            </div>
          </div>

          <div className="w-full sm:w-2/3 p-4">
            <h6 className="mb-5 pb-2 border-b font-semibold text-gray-800">
              Information
            </h6>

            <div className="flex mb-5">
              <div className="w-1/2">
                <p className="mb-2 font-semibold text-gray-700">Exam Date</p>

                <h6 className="text-gray-800">{formattedDate}</h6>
              </div>

              <div className="w-1/2">
                <p className="mb-2 font-semibold text-gray-700">Exam Time</p>

                <h6 className="text-gray-800">{formattedTime}</h6>
              </div>
            </div>

            <div className="flex mb-5">
              <div className="w-1/2">
                <p className="mb-2 font-semibold text-gray-700">Duration</p>

                <h6 className="text-gray-800">{exam.Duration}</h6>
              </div>
            </div>

            <div className="w-full sm:w-2/3 p-4">
              {countdown && (
                <p className="text-sm mt-4 text-gray-500 text-center">
                  Your quiz will start in{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {new Date(countdown).toISOString().substr(14, 5)}
                  </span>{" "}
                  minutes
                </p>
              )}

              {!isQuizEnabled && countdown <= 0 && countdown == null && (
                <p className="text-sm mt-4 text-red-500 text-center">
                  You are late for the exam.
                </p>
              )}

              <div className="flex justify-center mt-7">
                <button
                  onClick={handleStartQuiz}
                  className={`text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 ${
                    isQuizEnabled ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isQuizEnabled}
                >
                  Next Page
                </button>

                <button
                  onClick={handleLogout}
                  className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
