import React, { useEffect, useState } from "react";

import axios from "axios";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

// import { Table, TableHead, TableCell, TableRow, TableBody, styled } from '@mui/material';

import { NavLink } from "react-router-dom";

import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios

      .get("http://localhost:5000/api/v1/users", config)

      .then((response) => {
        const { adminUsers } = response.data; // Extract adminUsers array from response

        setUsers(Array.isArray(adminUsers) ? adminUsers : []); // Store adminUsers in the state
      })

      .catch((error) => console.log(error));
  }, []);

  const deleteuser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:5000/api/v1/delete/users/${id}`,
        config
      );

      // Update the list of users after successful deletion

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* pagecontent */}

      <div className="container mx-auto  px-40 pt-12">
        <div className="flex justify-end mb-2 mt-5 mr-3">
          <NavLink
            to="/setting/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Admin
          </NavLink>
        </div>

        <table className="table-auto w-full border  rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="px-4 py-2">Id</th>

              <th className="px-4 py-2">Name</th>

              <th className="px-4 py-2">Username</th>

              <th className="px-4 py-2">Email</th>

              <th className="px-4 py-2">Phone</th>

              <th className="px-4 py-2">Role</th>

              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-4 py-2">{index + 1}</td>

                <td className="px-4 py-2">{user.name}</td>

                <td className="px-4 py-2">{user.username}</td>

                <td className="px-4 py-2">{user.email}</td>

                <td className="px-4 py-2">{user.phone}</td>

                <td className="px-4 py-2">{user.role}</td>

                <td className="px-4 py-2 flex justify-end text-center">
                  <NavLink
                    to={"/setting/view/" + user._id}
                    // to={`/view/${user.id}`} bg-blue-500 hover:bg-blue-700 text-white

                    className="w-8 h-8 mt-2 text-white border mr-2 bg-yellow-500 rounded-md"
                  >
                    <RemoveRedEyeOutlinedIcon />
                  </NavLink>

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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
