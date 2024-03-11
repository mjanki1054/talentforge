import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { BsTrash, BsArrowLeftShort } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import FilterOption from "../../TableComponents/FilterOption";
import Pagination from "../../TableComponents/Pagination";

function Questionsetview() {
  const [questionSets, setQuestionSets] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  let pageSize = 5;

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/questionset/question/list/${id}`)
      .then((response) => response.json())

      .then((data) => {
        setQuestionSets(data);
      })

      .catch((error) => {
        console.error("Error:", error);

        setError("An error occurred while fetching question sets.");
      });
  }, []);

  const deleteQuestion = (questionId) => {
    fetch(`http://localhost:5000/api/v1/delete/question/${id}/${questionId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Update the state after successful deletion
        setQuestionSets((prevQuestionSets) =>
          prevQuestionSets.filter(
            (questionSet) => questionSet.questionId !== questionId
          )
        );
        setShowDeleteConfirmation(false); // Close the delete confirmation popup
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error scenario
      });
  };

  const showDeleteConfirmationPopup = (id) => {
    setDeleteQuestionId(id);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmationPopup = () => {
    setShowDeleteConfirmation(false);
  };

  const confirmDeleteQuestion = () => {
    if (deleteQuestionId) {
      deleteQuestion(deleteQuestionId);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: (row, index) => index + 1 + pageIndex * pageSize,
        Cell: ({ value }) => <span>{value}</span>,
      },
      { Header: "Questions", accessor: "question" },
      { Header: "Options", accessor: "options" },
      { Header: "Correct Answer", accessor: "correctAnswer" },
      { Header: "Action" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    setPageSize,
  } = useTable(
    {
      columns,
      data: questionSets,
      initialState: { pageIndex: 0, pageSize: 5 }, // Setting initial pageIndex here
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Update 'pageIndex' after getting state from the hook
  pageSize = state.pageSize

  return (
    <>
      <ToastContainer />
      <div className="container px-2 py-1 mt-10 mb-20 ml-8 max-w-screen-xl shadow-xl shadow-top shadow-left shadow-right shadow-bottom bg-white border border-blue rounded-lg">
        <div className="overflow-x-auto overflow-y-hidden">
          <button className="mt-5 mb-5 text-white flex items-center bg-blue-600 px-2 rounded-md">
            <BsArrowLeftShort className="w-6 h-6 text-white" />
            <NavLink
              to="/questionset/add"
              className="m-2 font-bold items-center"
            >
              Back
            </NavLink>
          </button>
          <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1">
            <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="shadow-lg">
            <table className="table-auto w-full" {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="bg-white text-gray-600 text-center"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
                {questionSets
                  .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
                  .map((questionSet, index) => (
                    <tr
                      key={index}
                      className="text-center border-b border-gray-200 hover:bg-gray-100"
                      style={{
                        borderLeft: "none",
                        borderRight: "none",
                        borderTop: "1px solid lightgray",
                        borderBottom: "1px solid lightgray",
                      }}
                    >
                      <td className="px-4 py-2">
                        {index + 1 + pageIndex * pageSize}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {questionSet.question}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        <ul>
                          {questionSet.options.map((option, optionIndex) => (
                            <li key={optionIndex}>{option}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4">
                        <p>{questionSet.correctAnswer}</p>
                      </td>
                      <td>
                        <button
                          className="w-8 h-8 mt-2 text-gray-600 hover:text-red-700 transition-colors"
                          onClick={() =>
                            showDeleteConfirmationPopup(questionSet.questionId)
                          }
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
        </div>
        <Pagination
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
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
                onClick={confirmDeleteQuestion}
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
}

export default Questionsetview;