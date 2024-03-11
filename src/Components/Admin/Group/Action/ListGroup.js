import { NavLink } from "react-router-dom";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import axios from "axios";
import FilterOption from "../../TableComponents/FilterOption";
import SearchFilter from "../../TableComponents/SearchFilter";
import Pagination from "../../TableComponents/Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ListGroup() {
  let navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const fetchGroupsRef = useRef(false); // Ref to track component mount state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);

  const fetchGroups = useCallback(() => {
    axios
      .get("http://localhost:5000/api/v1/groups")
      .then((response) => {
        const { groups } = response.data; // Retrieve the 'groups' array from the response
        console.log(groups,"line no 33")
        if (fetchGroupsRef.current) {
          setGroups(Array.isArray(groups) ? groups : []); // Update the 'groups' state
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchGroupsRef.current = true; // Component mounted
    fetchGroups();
    return () => {
      fetchGroupsRef.current = false; // Component unmounted
    };
  }, [fetchGroups]);

  const deleteGroup = (groupId) => {
    axios
      .delete(`http://localhost:5000/api/v1/delete/groups/${groupId}`)
      .then((response) => {
        console.log(response.data.message);
        fetchGroups();
        setShowDeleteConfirmation(false); // Close the delete confirmation popup
      })
      .catch((error) => console.log(error));
  };

  const editGroup = (row) => {
    navigate(`/group/edit/${row.original._id}`, {
      state: { group: row.original },
    });
  };

  const showDeleteConfirmationPopup = (id) => {
    setDeleteGroupId(id);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmationPopup = () => {
    setShowDeleteConfirmation(false);
  };

  const confirmDeleteGroup = () => {
    if (deleteGroupId) {
      deleteGroup(deleteGroupId);
      window.location.reload();
    }
  };

  const columns = React.useMemo(
    () => [
      // Define your columns here
      {
        Header: "Id",
        accessor: (row, index) => index + 1, // Update the accessor to _id
      },
      {
        Header: "Group Name",
        accessor: "groupname",
      },
      {
        Header: "Total No. Of Candidates",
        accessor: "numbers",
      },
      {
        Header: "Candidates",
        accessor: "candidates",
        Cell: ({ value }) => {
          return (
            <>
              {value.map((candidate, index) => (
                <React.Fragment key={index}>
                  <span>{candidate.name}</span>
                  {index !== value.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </>
          );
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          const groupId = row.original._id;
          return (
            <div className="flex justify-end">
              <button
                className="w-8 h-8 mt-2 text-gray-600 hover:text-blue-700"
                onClick={() => editGroup(row)}
              >
                <AiOutlineEdit
                  className="transition-all transform hover:scale-150"
                  size={20}
                  style={{ fill: "rgb(98 ,200, 224)" }}
                />
              </button>
              <button
                className="w-8 h-8 mt-2 text-gray-600 hover:text-red-700 transition-colors xl:mr-20"
                onClick={() => showDeleteConfirmationPopup(groupId)}
              >
                <BsTrash
                  className="transition-all transform hover:scale-150"
                  style={{ fill: "#ff0000cf" }}
                />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    setPageSize,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
  } = useTable(
    {
      columns,
      data: groups,
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
      <div className="container px-2 py-1 mt-12 mb-10 ml-8 mx-auto max-w-screen-xl shadow-md bg-white border border-blue rounded-lg">
        <div className="flex items-center justify-between mb-4 mt-2 pt-3 pr-3">
          {/* Filter option */}
          <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
          {/* Search field */}
          <SearchFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <table {...getTableProps()} className="table-auto w-full">
          <thead className="text-center">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-white text-gray-600 text-center"
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
          <tbody {...getTableBodyProps()} className="text-center">
            <>
              {page.map((row, index) => {
                // Update this line
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
                          className="px-4 py-2"
                          key={cell.column.id}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
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
                onClick={confirmDeleteGroup}
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

export default ListGroup;