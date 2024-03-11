import React, { useEffect, useState } from 'react';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination } from "react-table";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import FilterOption from "../../TableComponents/FilterOption";
import SearchFilter from "../../TableComponents/SearchFilter";
import Pagination from "../../TableComponents/Pagination";

const ListSubject = () => {
    const [Subject, setSubject] = useState([]);
    //changes
    const [editId, setEditid] = useState(-1);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteSubjectId, setDeleteSubjectId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios
            .get('http://localhost:5000/api/v1/all/subject', config)
            .then(response => {
                const { subjects } = response.data;
                console.log("subjects", subjects)
                setSubject(Array.isArray(subjects) ? subjects : []);
            })
            .catch(error => console.log(error));
    }, []);

    const saveSubject = async (id) => {
        try {

            // Retrieve the edited user data from the input fields
            const updatedSubject = {
                subjectName: document.getElementById(`subjectName_${id}`).value,
                description: document.getElementById(`description_${id}`).value
            };

            if (updatedSubject.subjectName.length < 4 || updatedSubject.subjectName.length > 30) {
                toast.error("Subject name should be between 4 and 30 characters", {
                    position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
                    autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
                    className: "mt-10"
                });

                return;
            };

            if (updatedSubject.description.length < 30 || updatedSubject.description.length > 60) {
                toast.error("Description should be between 30 and 60 characters", {
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
                `http://localhost:5000/api/v1/update/subject/${id}`,
                updatedSubject,
                config
            );
            setEditid(-1); // Clear the edited row after saving

            // Update the users array in the state with the modified user data
            setSubject((prevSubjects) =>
                prevSubjects.map((subject) =>
                    subject._id === id ? { ...subject, ...updatedSubject } : subject
                )
            );
            toast.success("Subject saved successfully!", {
                position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
                autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
                className: "mt-10"
            });
        } catch (error) {
            console.log(error);
        }
    };

    const editSubject = (id) => {
        const stringId = id.toString();
        setEditid(stringId);
        console.log(stringId);
    };

    const cancelEdit = () => {
        setEditid(-1); // Clear the edited row without saving
    };

    const deletesubject = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(`http://localhost:5000/api/v1/delete/subject/${id}`, config);

            // Update the list of users after successful deletion
            setSubject(prevSubjects => prevSubjects.filter(subject => subject._id !== id));
            setShowDeleteConfirmation(false); // Close the delete confirmation popup
        } catch (error) {
            console.log(error);
        }
    };

    const showDeleteConfirmationPopup = (id) => {
        setDeleteSubjectId(id);
        setShowDeleteConfirmation(true);
    };

    const closeDeleteConfirmationPopup = () => {
        setShowDeleteConfirmation(false);
    };

    const confirmDeleteSubject = () => {
        if (deleteSubjectId) {
            deletesubject(deleteSubjectId);
        }
    };

    const columns = React.useMemo(
        () => [
            { Header: "Id", accessor: "Id" },
            { Header: "SubjectName", accessor: "subjectName" },
            { Header: "Description", accessor: "description" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className="flex justify-center items-center space-x-2">
                        {editId === row.original._id ? (
                            <>
                                <button
                                    onClick={() => saveSubject(row.original._id)}
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
                                    onClick={() => editSubject(row.original._id)}
                                    className="w-8 h-8 mt-2 text-gray-600 hover:text-blue-700"
                                    style={{ paddingTop: "0.4rem" }}
                                >
                                    <AiOutlineEdit className="transition-all transform hover:scale-150" size={20} style={{ fill: "rgb(98 ,200, 224)" }} />
                                </button>

                                <button
                                    onClick={() => showDeleteConfirmationPopup(row.original._id)}
                                    className="w-8 h-8 mt-3 text-gray-600 hover:text-red-700 transition-colors"
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
            data: Subject,
            initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page index and page size
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { pageIndex, pageSize, globalFilter } = state;

    return (
        <>
            <ToastContainer />
            <div className="container px-2 py-1 mt-10 mb-10 ml-8 max-w-screen-xl shadow-xl shadow-top shadow-left shadow-right shadow-bottom bg-white border border-blue rounded-lg">
                <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1">
                    {/* Filter option */}
                    <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
                    {/* Search field */}
                    <SearchFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                </div>
                <table {...getTableProps()} className="table-fixed w-full">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr
                                {...headerGroup.getHeaderGroupProps()}
                                className="bg-white text-gray-600 text-center"
                            >
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="px-4 py-2 w-1/4"
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
                {/* Pagination */}
                <div className="flex justify-end mt-4">
                    <Pagination
                        pageIndex={pageIndex} pageOptions={pageOptions} canPreviousPage={canPreviousPage} canNextPage={canNextPage} pageCount={pageCount}
                        gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage}
                    />
                </div>
            </div>
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
                                onClick={confirmDeleteSubject}
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
    )
}

export default ListSubject