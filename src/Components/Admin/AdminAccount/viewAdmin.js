import React, { useEffect, useState } from "react";

import axios from "axios";

import profile from "../../../logo/profile.png";

import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";

import MailOutlineIcon from "@mui/icons-material/MailOutline";

import WorkIcon from "@mui/icons-material/Work";

import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

import LocationOnIcon from "@mui/icons-material/LocationOn";

import { NavLink, useParams, useNavigate } from "react-router-dom";

import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

const ViewUser = () => {
  const [user, setUser] = useState({});

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/users/${id}`)

      .then((response) => {
        const { data } = response;

        console.log("response data one", response);

        setUser(data?.user);
      })

      .catch((error) => console.log(error));
  }, [id]);

  const deleteuser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/delete/users/${id}`);

      navigate("/candidate/list"); // Navigate to "/candidate/list" after successful deletion
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mt-3 mx-auto max-w-xl">
        <h1 className="font-medium text-2xl mb-4">Welcome, {user.username}</h1>

        <Card>
          <CardContent>
            <div className="flex justify-end mb-4">
              {/* <NavLink to={`/edit/${getuserdata._id}`}> */}

              <NavLink
                to={`/setting/edit/${user._id}`}
                className="w-8 h-8 mt-2 text-white border mr-2 bg-green-600 rounded-md"
              >
                <PencilIcon />
              </NavLink>

              <button
                onClick={() => deleteuser(user._id)}
                className="w-8 h-8 mt-2 text-white border mr-2 bg-red-600 rounded-md"
              >
                <TrashIcon />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="left_view">
                <img
                  src={profile}
                  className="w-12 rounded-full"
                  alt="profile"
                />

                <h3 className="mt-3 text-lg font-medium">
                  Name: <span className="font-normal">{user.name}</span>
                </h3>

                <p className="mt-3 flex items-center">
                  <MailOutlineIcon className="mr-2" />
                  Email: <span className="font-medium ml-1">{user.email}</span>
                </p>

                <p className="mt-3 flex items-center">
                  <WorkIcon className="mr-2" />
                  Role: <span className="font-medium ml-1">{user.role}</span>
                </p>
              </div>

              <div className="right_view">
                <p className="mt-5 flex items-center">
                  <PhoneAndroidIcon className="mr-2" />
                  mobile: <span className="font-medium ml-1">{user.phone}</span>
                </p>

                <p className="mt-3 flex items-center">
                  <LocationOnIcon className="mr-2" />
                  Address:{" "}
                  <span className="font-medium ml-1">{user.address}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ViewUser;
