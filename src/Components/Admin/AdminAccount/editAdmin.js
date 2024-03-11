import React, { useState } from "react";

import axios from "axios";

import { useEffect } from "react";

import { NavLink, useParams } from "react-router-dom";

import { ViewListIcon } from "@heroicons/react/outline";

const initialValue = {
  name: "",

  username: "",

  email: "",

  phone: "",

  address: "",

  role: "",

  imageUrl: "",
};

const EditUser = () => {
  const [user, setUser] = useState(initialValue);

  const { name, username, email, phone, address, role, imageUrl } = user;

  const { id } = useParams();

  // Function to load user details

  const loadUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/users/${id}`
      ); // Replace "id" with the actual user ID

      const userData = response.data.user; // Assuming the user details are returned in the "user" property

      setUser(userData);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Function to update user details

  const editUserDetails = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/update/users/${id}`,
        user
      );

      const updatedUserData = response.data.user; // Assuming the updated user details are returned in the "user" property

      console.log("Updated user details:", updatedUserData);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []); // Call loadUserDetails when the component mounts

  const onValueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onFileChange = (event) => {
    setUser({
      ...user,

      profile: event.target.files[0],
    });
  };

  return (
    <div>
      {/* pagecontent */}

      <div className="container mx-auto  px-40 pt-12">
        <div className="flex relative justify-between items-center">
          <NavLink to="/setting/add" className="m-2 font-bold items-center">
            Add Admin
          </NavLink>

          <NavLink to="/setting/Account">
            <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-md">
              <ViewListIcon className="h-5 w-5" />

              <h1 className="font-bold ml-2 py-1">LIST</h1>
            </button>
          </NavLink>
        </div>

        <form className="border border-blue-300 shadow-lg px-10 pt-4 rounded-xl">
          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={name}
                onChange={onValueChange}
              />
            </div>

            <div className="mb-4 w-1/2">
              <label htmlFor="username" className="block mb-1 font-medium">
                Username
              </label>

              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={username}
                onChange={onValueChange}
              />
            </div>
          </div>

          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>

              <input
                type="text"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={email}
                onChange={onValueChange}
              />
            </div>

            <div className="mb-4 w-1/2">
              <label htmlFor="phone" className="block mb-1 font-medium">
                Phone
              </label>

              <input
                type="text"
                id="phone"
                name="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={phone}
                onChange={onValueChange}
              />
            </div>
          </div>

          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label htmlFor="address" className="block mb-1 font-medium">
                Address
              </label>

              <input
                type="text"
                id="address"
                name="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={address}
                onChange={onValueChange}
              />
            </div>

            <div className="mb-4 w-1/2 mr-4">
              <label htmlFor="role" className="block mb-1 font-medium">
                {" "}
                Role{" "}
              </label>

              <select
                id="role"
                name="role"
                value={role}
                onChange={onValueChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">--Select Role--</option>

                <option value="Admin">Admin</option>

                <option value="User">User</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <NavLink to="/setting/Account">
              <button
                type="button"
                className="w-full font-bold px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-700"
                onClick={editUserDetails}
              >
                Edit
              </button>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
