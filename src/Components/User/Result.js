import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Fetch user details from the API

    const fetchUserDetails = async () => {
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

        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  if (!userDetails) {
    // Loading state while fetching user details

    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border shadow-xl py-10 px-20 flex flex-col justify-center items-center">
        <h1 className="m-5 font-bold text-xl">
          Your Score is {userDetails.user.score} out of{" "}
          {userDetails.questionSetName[0].totalQuestions}
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-xl font-bold mb-5 bg-teal-500 hover:bg-blue-700 text-white py-2 px-4"
        >
          Logout
        </button>

        <h5 className="text-sm mb-5">
          Soon, HR will contact you. Thank You !!!
        </h5>
      </div>
    </div>
  );
};

export default Result;
