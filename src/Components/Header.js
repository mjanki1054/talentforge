import React, { useState, useRef, useEffect } from "react";

import axios from "axios";

import NCLogo from "../logo/NCLogo.png";

import profile from "../logo/profile.png";

import { NavLink } from "react-router-dom";

import NotificationsIcon from "@mui/icons-material/Notifications";

import EmailIcon from "@mui/icons-material/Email";

import Title from "../logo/title.png";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { UserAddIcon } from "@heroicons/react/outline";

import CameraEnhanceOutlinedIcon from "@mui/icons-material/CameraEnhanceOutlined";

const Header = () => {
  const [user, setUser] = useState({});

  const [showPopup, setShowPopup] = useState(false); // state to control popup display

  const popupRef = useRef(null); // reference to the popup element

  const togglePopup = () => setShowPopup(!showPopup); // function to toggle popup display

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false); // close popup if the click is outside the popup element
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("http://localhost:5000/api/v1/admin/details/${email}", config)

      .then((response) => {
        const { data } = response;
        setUser(data.user);
      })

      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <header className=" px-4 py-2 flex justify-between items-center bg-gradient-to-b from-blue-300 to-blue-900 py-1">
        {/* <header className="px-4 py-2 flex justify-between items-center bg-gradient-to-b from-blue-300 to-blue-900"> */}

        <NavLink
          to="/admin/home"
          className="flex items-center"
          onClick={() => setShowPopup(false)}
        >
          <img src={NCLogo} alt="logo" className="h-6 w-auto mr-2" />

          <img src={Title} alt="title" className="h-3 mr-2" />

          {/* <span className="text-xl  font-semibold text-white" style={{ fontFamily: 'Ethnocentric Regular' }}>TALENTFORGE</span> */}
        </NavLink>

        <div className="flex items-center">
          <div className="flex items-center space-x-2 mr-3">
            <NotificationsIcon className="text-white" />

            <EmailIcon className="text-white" />
          </div>

          <img
            src={profile}
            alt="logo"
            className="h-6 w-auto mr-2"
            onClick={togglePopup}
          />

          <NavLink
            data-dropdown-toggle="language-dropdown-menu"
            className="text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation(); // Prevent propagation to the parent div

              setShowPopup(!showPopup); // Toggle popup display
            }}
          >
            {user.name}
          </NavLink>
        </div>

        {showPopup && (
          <div className="absolute top-10 right-4 z-10 " ref={popupRef}>
            <div className="bg-gray-100 border rounded-lg shadow-lg p-1">
              <div className="border bg-white p-2 rounded-t-lg">
                <NavLink
                  to="/MyAccount"
                  className="flex items-center"
                  onClick={togglePopup}
                >
                  <div className="relative">
                    <img
                      src={profile}
                      alt="logo"
                      className="h-12 mr-2 cursor-pointer"
                    />

                    <CameraEnhanceOutlinedIcon className="absolute bottom-0 right-0 mr-2 text-gray-400 border border-gray-400 hover:bg-gray-200  rounded-full p-1 bg-gray-100" />
                  </div>

                  <div>
                    <h1 className="ml-2 text-sm">Admin</h1>

                    <h1 className="ml-2 text-xs text-gray-600">{user.email}</h1>
                  </div>
                </NavLink>

                <NavLink to="/myaccount">
                  <div className="flex items-center mt-2 ml-16">
                    <button className="hover:bg-gray-200 text-xs border rounded-md border-black w-full p-1 px-3 whitespace-nowrap">
                      Manage Your Account
                    </button>
                  </div>
                </NavLink>
              </div>

              <div className="border bg-white p-2 rounded-b-lg">
                <NavLink
                  to="/Myaccount"
                  className="flex items-center h-10 hover:bg-gray-100 "
                  onClick={togglePopup}
                >
                  <img
                    src={profile}
                    alt="logo"
                    className="h-8 mr-2 pl-1 cursor-pointer"
                  />

                  <div className="ml-4">
                    <h1 className="ml-2 text-xs ">Admin</h1>

                    <h1 className="ml-2 text-xs text-gray-600">{user.email}</h1>
                  </div>
                </NavLink>

                <NavLink to="/setting/add">
                  <div className="flex mt-1 items-center h-10 hover:bg-gray-100 ">
                    <UserAddIcon className="h-5 w-1/4 pr-1 text-gray-600" />

                    <h1 className="ml-4 text-xs whitespace-nowrap ">
                      Add another Account
                    </h1>
                  </div>
                </NavLink>
              </div>

              <NavLink
                to="/"
                className="flex items-center my-1 ml-5"
                onClick={togglePopup}
              >
                <LogoutOutlinedIcon className="h-6 text-gray-600 ml-1" />

                <h1
                  className="ml-7 text-xs"
                  onClick={() => {
                    localStorage.removeItem("token");
                  }}
                >
                  Sign out
                </h1>
              </NavLink>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
