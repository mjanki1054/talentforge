import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { BsTrash, BsEye, BsPlusLg } from "react-icons/bs";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import FilterOption from "../../TableComponents/FilterOption";
import Pagination from "../../TableComponents/Pagination";
import SearchBar from "./SearchBar";

const SetList = () => {
  const [questionData, setQuestionData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchQuestionData = () => {
      axios
        .get("http://localhost:5000/api/v1/questionset")
        .then((response) => {
          const questionSet = response.data;
          console.log(questionSet, "line no 23");
          setQuestionData(Array.isArray(questionSet) ? questionSet : []);
        })
        .catch((error) => console.log(error));
    };
    fetchQuestionData();
  }, []);

  const deleteQuestionSet = (questionSetId) => {
    axios
      .delete(
        `http://localhost:5000/api/v1/delete/questionset/${questionSetId}`
      )
      .then((response) => {
        console.log(response.data.message);

        // Update the questionData state after successful deletion
        setQuestionData((prevQuestionData) =>
          prevQuestionData.filter(
            (questionSet) => questionSet._id !== questionSetId
          )
        );
      })
      .catch((error) => console.log(error));
  };

  // Add a console.log to check the search filter value
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
      { Header: "Question Set Name", accessor: "questionSetName" },
      { Header: "Total Questions", accessor: "totalQuestions" },
      { Header: "Subjects", accessor: "subject" },
      { Header: "Action" },
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
      data: questionData,
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
      <div className="container px-2 py-1 mt-10 mb-10 ml-8 max-w-screen-xl shadow-xl shadow-top shadow-left shadow-right shadow-bottom bg-white border border-blue rounded-lg">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1">
            <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
            {/* Use the SearchBar component */}
            <SearchBar value={searchQuery} onChange={handleSearch} />
          </div>
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
                {questionData
                  .filter((questionSet) =>
                    questionSet.questionSetName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
                  .map((questionSet, index) => (
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
                      <td className="px-4 py-2 text-center">
                        {questionSet.questionSetName}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {questionSet.totalQuestions}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {Array.isArray(questionSet.subject) ? (
                          questionSet.subject.map((subject, subjectIndex) => (
                            <span key={subjectIndex} className="block text-xs">
                              {subject.subjectName} - Question(
                              {questionSet.questionNo[subjectIndex]})
                            </span>
                          ))
                        ) : (
                          <span>Invalid subjects</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex ">
                        <NavLink to={`/questionset/view/${questionSet._id}`}>
                          <button className="w-8 h-8 mt-2 text-gray-600 hover:text-black-700">
                            <BsEye
                              className="transition-all transform hover:scale-150"
                              style={{ fill: "rgb(232, 149, 39)" }}
                            />
                          </button>
                        </NavLink>
                        <NavLink
                          to={{
                            pathname: `/questionset/subjects/${questionSet._id}`,
                            state: { questionSetId: questionSet._id },
                          }}
                        >
                          <button className="w-8 h-8 mt-2 text-gray-600 hover:text-blue-700 transition-colors">
                            <BsPlusLg
                              className="transition-all transform hover:scale-150"
                              style={{ fill: "#0000FF" }}
                            />
                          </button>
                        </NavLink>
                        <button
                          onClick={() => deleteQuestionSet(questionSet._id)}
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
        </div>
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
    </>
  );
};

export default SetList;
