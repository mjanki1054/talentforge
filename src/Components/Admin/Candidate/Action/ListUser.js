import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination } from "react-table";
import { BsTrash, BsEye } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import defaultImage from '../../../../logo/profile.png'
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BsCamera } from 'react-icons/bs';
import FilterOption from "../../TableComponents/FilterOption";
import SearchFilter from "../../TableComponents/SearchFilter";
import Pagination from "../../TableComponents/Pagination";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditid] = useState(-1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(defaultImage);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:5000/api/v1/users",
          config
        );
        const { normalUsers } = response.data;
        setUsers(Array.isArray(normalUsers) ? normalUsers : []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const editUser = (id) => {
    const stringId = id.toString();
    setEditid(stringId);
    console.log(stringId);
  };

  const saveUser = async (id) => {
    try {
      // Retrieve the edited user data from the input fields
      const updatedUser = {
        name: document.getElementById(`name_${id}`).value,
        username: document.getElementById(`username_${id}`).value,
        email: document.getElementById(`email_${id}`).value,
        phone: document.getElementById(`phone_${id}`).value,
        address: document.getElementById(`address_${id}`).value,
      };

      // Validation regex patterns
      const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
      const usernameRegex = /^[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*$/;
      const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
      const phoneRegex = /^\d{0,10}$/;
      const addressRegex = /^[A-Za-z0-9,'".-]+(?: [A-Za-z0-9,'".-]+)*$/;

      // Validate the fields
      if (!nameRegex.test(updatedUser.name)) {
        toast.error("Invalid name", {
          position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
          autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
          className: "mt-10"
        });

        return;
      }

      if (!usernameRegex.test(updatedUser.username)) {
        toast.error("Invalid username", {
          position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
          autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
          className: "mt-10"
        });
        return;
      }

      if (!emailRegex.test(updatedUser.email)) {
        toast.error("Invalid email", {
          position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
          autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
          className: "mt-10"
        });
        return;
      }

      if (!phoneRegex.test(updatedUser.phone)) {
        toast.error("Invalid phone number", {
          position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
          autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
          className: "mt-10",
          toastClassName: 'text-red-500'
        });
        return;
      }

      if (!addressRegex.test(updatedUser.address)) {
        toast.error("Invalid address", {
          position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
          autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
          className: "mt-10"
        });
        return;
      }

      // Send the updated user data to the server
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/v1/update/users/${id}`,
        updatedUser,
        config
      );
      setEditid(-1); // Clear the edited row after saving

      // Update the users array in the state with the modified user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, ...updatedUser } : user
        )
      );
      toast.success("Candidate edited successfully!", {
        position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
        autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
        className: "mt-10"
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEditid(-1); // Clear the edited row without saving
  };

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
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setShowDeleteConfirmation(false); // Close the delete confirmation popup
    } catch (error) {
      console.log(error);
    }
  };

  //show candidates details by clicking Bseye icon
  const navigateToUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/${id}`);
      const { user } = response.data;
      setUserData(user);

      if (user.imageUrl) {
        setProfile(user.imageUrl);
      } else {
        setProfile(defaultImage);
      }

      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const showDeleteConfirmationPopup = (id) => {
    setDeleteUserId(id);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmationPopup = () => {
    setShowDeleteConfirmation(false);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      deleteuser(deleteUserId);
    }
  };

  // Define table columns and data
  const columns = React.useMemo(
    () => [
      { Header: "Id", accessor: "Id" },
      { Header: "Name", accessor: "name" },
      { Header: "Username", accessor: "username" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Address", accessor: "address" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex justify-center items-center space-x-2">
            {editId === row.original._id ? (
              <>
                <button
                  onClick={() => saveUser(row.original._id)}
                  className="text-green-500 hover:text-green-600 shadow-md bg-red border border-blue rounded-lg px-2 pb-1"
                  style={{ paddingTop: "0.4rem" }}
                >
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  className="text-red-500 hover:text-red-600 shadow-md bg-red border border-blue rounded-lg px-2 pb-1"
                  style={{ paddingTop: "0.4rem" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateToUser(row.original._id)}
                  className="w-8 h-8 mt-2 text-gray-600 hover:text-black-700"
                  style={{ paddingTop: "0.5rem" }}
                >
                  <BsEye className="transition-all transform hover:scale-150" style={{ fill: "rgb(232, 149, 39)" }} />
                </button>

                <button
                  onClick={() => editUser(row.original._id)}
                  className="w-8 h-8 mt-2 text-gray-600 hover:text-blue-700"
                  style={{ paddingTop: "0.4rem" }}
                >
                  <AiOutlineEdit className="transition-all transform hover:scale-150" size={20} style={{ fill: "rgb(98 ,200, 224)" }} />
                </button>

                <button
                  onClick={() => showDeleteConfirmationPopup(row.original._id)}
                  className="w-8 h-8 mt-2 text-gray-600 hover:text-red-700 transition-colors"
                >
                  <BsTrash className="transition-all transform hover:scale-150" style={{ fill: "#ff0000cf" }} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [editId]
  );

  // Create an instance of the table hook
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: users,
      initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page index and page size
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;


  const handleImageEdit = () => {
    console.log("button is clicked")
  };


  return (
    <>
      <ToastContainer />
      <div className="container px-2 py-1 mt-10 mb-10 ml-8 max-w-screen-xl shadow-xl shadow-top shadow-left shadow-right shadow-bottom bg-white border border-blue rounded-lg">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1">
            {/* Filter option */}
            <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
            {/* Search field */}
            <SearchFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </div>
          {/* Table start */}
          <div className="shadow-lg">
            <table {...getTableProps()} className="table-fixed w-full">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="bg-blue-400 text-gray-600 text-center"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="px-4 py-2 w-1/6"
                        key={column.id}
                      >
                        <div className="flex items-center justify-center">
                          <span>{column.render("Header")}</span>
                          <span className="ml-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <svg
                                  className="inline-block w-4 h-4 animate-bounce"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="inline-block w-4 h-4 animate-bounce"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  const isEvenRow = index % 2 === 0;
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`${isEvenRow ? "bg-white" : "bg-gray-50"}`}
                      style={{
                        borderLeft: "none",
                        borderRight: "none",
                        borderTop: "1px solid lightgray",
                        borderBottom: "1px solid lightgray",
                      }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-4 py-2 text-gray-700 text-center"
                          >
                            {cell.column.id === "Id" ? (
                              row.index + 1
                            ) : editId === row.original._id && cell.column.id !== "Actions" ? (
                              <input
                                type="text"
                                id={`${cell.column.id}_${row.original._id}`}
                                defaultValue={row.values[cell.column.id]}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              cell.render("Cell")
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>

          {/* Table end */}
        </div>
        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <Pagination
            pageIndex={pageIndex} pageOptions={pageOptions} canPreviousPage={canPreviousPage} canNextPage={canNextPage} pageCount={pageCount}
            gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage}
          />
        </div>
      </div>
      {/* POPUP CARD */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-20">
          <div className="bg-white rounded-lg shadow-2xl w-full sm:w-1/2 relative animate-fade-in-down">
            <button
              className="absolute top-4 right-4 text-red-300 hover:text-red-600 text-red-600 z-10 focus:outline-none"
              onClick={() => setModalOpen(false)}
            >
              <CloseIcon fontSize="large" />
            </button>
            <div className="flex flex-wrap p-8">
              <div className="w-full sm:w-1/3 bg-gradient-to-b from-blue-200 to-blue-400 rounded-l-md">
                <div className="p-4 text-center text-white">
                  <div className="mb-6 relative">
                    <img src={profile} className="rounded-full h-32 w-32 mx-auto mt-10 object-cover" alt="Profile" />
                    <button
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 text-gray-600 hover:text-black-700 hover:bg-gray-200 transition-all duration-300"
                      onClick={handleImageEdit}
                    >
                      <BsCamera className="h-5 w-5" />
                    </button>
                  </div>
                  <h6 className="font-semibold text-lg">{userData.name}</h6>
                  <p className="mb-1 text-xs font-semibold uppercase">{userData.role}</p>
                  <i className="feather icon-edit mt-4 text-lg"></i>
                </div>
              </div>
              <div className="w-full sm:w-2/3 p-4">
                <h6 className="mb-5 pb-2 border-b font-semibold text-gray-800">Information</h6>
                <div className="flex mb-5">
                  <div className="w-1/2">
                    <p className="mb-2 font-semibold text-gray-700">Username</p>
                    <h6 className="text-gray-800">{userData.username}</h6>
                  </div>
                  <div className="w-1/2">
                    <p className="mb-2 font-semibold text-gray-700">Email</p>
                    <h6 className="text-gray-800">{userData.email}</h6>
                  </div>
                </div>
                <div className="flex mb-5">
                  <div className="w-1/2">
                    <p className="mb-2 font-semibold text-gray-700">Phone</p>
                    <h6 className="text-gray-800">{userData.phone}</h6>
                  </div>
                  <div className="w-1/2">
                    <p className="mb-2 font-semibold text-gray-700">Address</p>
                    <h6 className="text-gray-800">{userData.address}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <BsTrash className="text-red-500 mr-2" size={20} />
              <p className="text-lg">Are you sure you want to delete?</p>
            </div>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 text-white rounded-lg mr-2 focus:outline-none" style={{ backgroundColor: "rgb(98 ,200, 224)" }}
                onClick={confirmDeleteUser}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-red-400 text-white rounded-lg"
                onClick={closeDeleteConfirmationPopup}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListUser