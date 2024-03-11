import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { BsTrash } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import FilterOption from "../../TableComponents/FilterOption";
import SearchBar from "../../Question/Actions/SearchBar";
import Pagination from "../../TableComponents/Pagination";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ListExam = () => {
  let navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchExams = () => {
      axios
        .get("http://localhost:5000/api/v1/allexams")
        .then((response) => {
          const examsData = response.data.exams;

          setExams(Array.isArray(examsData) ? examsData : []);
        })

        .catch((error) => {
          console.log(error, "error error");
        });
    };

    fetchExams();
  }, []);

  const deleteExam = (examid) => {
    axios
      .delete(`http://localhost:5000/api/v1/delete/exam/${examid}`)
      .then((response) => {
        console.log(response.data.message);

        // Find the deleted exam
        const deletedExam = exams.find((exam) => exam._id === examid);
        const assignmentId = deletedExam.assignment[0]._id; // Assuming only one assignment
        console.log(assignmentId, "line no 76");

        // Make an API call to update the group's hasAssigned property to false
        axios
          .put(`http://localhost:5000/api/v1/groups/${assignmentId}/status`, {
            hasAssigned: false,
          })
          .then((response) => {
            console.log(response.data);

            // Update the exams data in the frontend
            const updatedExams = exams.filter((exam) => exam._id !== examid);
            setExams(updatedExams);
          })
          .catch((error) => {
            console.log(error);
          });

        setShowDeleteConfirmation(false);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    console.log(exams, "exams value check");
  }, [exams]);

  const editExam = (examid) => {
    const exam = exams.find((exam) => exam._id === examid);

    navigate(`/exam/edit/${examid}`, { state: { exam } });
  };

  const showDeleteConfirmationPopup = (id) => {
    setDeleteExamId(id);

    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmationPopup = () => {
    setShowDeleteConfirmation(false);
  };

  const confirmDeleteExam = () => {
    if (deleteExamId) {
      deleteExam(deleteExamId);
    }
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    console.log("Search Query:", searchQuery);
    setSearchQuery(searchQuery);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: (row, index) => index + 1 + pageIndex * pageSize,
        Cell: ({ value }) => <span>{value}</span>,
      },
      { Header: "Name", accessor: "examName" },
      { Header: "Assignment", accessor: "assignment" },
      { Header: "Question Set", accessor: "questionSetName" },
      { Header: "Negative Marks", accessor: "negativeMarks" },
      { Header: "Duration", accessor: "examDuration" },
      { Header: "Date & Time", accessor: "examDateTime" },
      { Header: "Actions" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    setGlobalFilter,
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
      data: exams,
      initialState: { pageIndex: 0, pageSize: 5 },
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
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1">
            <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
            {/* Use the SearchBar component */}
            <SearchBar value={searchQuery} onChange={handleSearch} />
          </div>

          <table className="table-auto w-full" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-white text-gray-600 text-center"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="py-2 w-1/8"
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
              {exams
                .filter((exam) =>
                  exam.examName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
                .map((exam, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                    style={{
                      borderLeft: "none",

                      borderRight: "none",

                      borderTop: "1px solid lightgray",

                      borderBottom: "1px solid lightgray",
                    }}
                  >
                    <td className="px-4 py-2 text-center">
                      {index + 1 + pageIndex * pageSize}
                    </td>

                    <td className="px-4 py-2 text-center">{exam.examName}</td>

                    <td className="px-4 py-2 text-center">
                      {exam.assignment && exam.assignment.length > 0 ? (
                        exam.assignment.map((assignment, index) => (
                          <span key={index}>{assignment.groupname}</span>
                        ))
                      ) : (
                        <span>No assignments</span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {exam.questionSetName &&
                        exam.questionSetName.length > 0 ? (
                        exam.questionSetName.map((questionSet, index) => (
                          <span key={index}>{questionSet.questionSetName}</span>
                        ))
                      ) : (
                        <span>No question set names</span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {exam.negativeMarks}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {exam.examDuration}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {format(
                        new Date(exam.examDateTime),
                        "MM/dd/yyyy hh:mm a"
                      )}
                    </td>

                    <td className="py-2 flex justify-center">
                      {/* AiOutlineEdit */}

                      <Link to={`/exam/edit/${exam._id}`} state={{ exam }}>
                        <button
                          className="w-8 h-8 mt-2 text-gray-600 hover:text-blue-700"
                          onClick={() => editExam(exam._id)}
                        >
                          <AiOutlineEdit
                            className="transition-all transform hover:scale-150"
                            size={20}
                            style={{ fill: "rgb(98 ,200, 224)" }}
                          />
                        </button>
                      </Link>

                      <button
                        onClick={() => showDeleteConfirmationPopup(exam._id)}
                        className="w-8 h-8 mt-2 text-gray-600 hover:text-red-700 transition-colors"
                      >
                        <BsTrash
                          className="transition-all transform hover:scale-150"
                          style={{ fill: "#ff0000cf" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="flex justify-end mt-4">
          <Pagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            pageCount={pageCount}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            gotoPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            setPageSize={setPageSize}
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
                className="px-4 py-2 text-white rounded-lg mr-2 focus:outline-none"
                style={{ backgroundColor: "rgb(98 ,200, 224)" }}
                onClick={confirmDeleteExam}
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

export default ListExam;
