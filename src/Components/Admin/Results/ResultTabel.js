import React, { useEffect, useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import { BsEye } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import Pagination from './Pagination';
import FilterOption from "./FilterOption";
import SearchFilter from "./SearchFilter";
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination } from "react-table";
import { Badge } from '@mui/material';

const Tabel = () => {
  const [editId, setEditid] = useState(-1);
  const [selectedGroup, setSelectedGroup] = useState(''); // State for selected group
  const [selectedDateRange, setSelectedDateRange] = useState([]); // State for selected date range

  // Filter function for group
  const filterByGroup = (rows, columnId) => {
    if (selectedGroup === '') {
      return rows;
    }
    return rows.filter(row => row.values[columnId] === selectedGroup);
  };

  // Filter function for date range
  const filterByDateRange = (rows, columnId) => {
    const startDate = selectedDateRange[0];
    const endDate = selectedDateRange[1];
    if (startDate && endDate) {
      return rows.filter(row => {
        const date = row.values[columnId];
        return date >= startDate && date <= endDate;
      });
    }
    return rows;
  };

  // Apply filters to get the filtered data
  const applyFilters = (rows) => {
    return filterByGroup(filterByDateRange(rows, 'Id'), 'group');
  };

  const cancelEdit = () => {
    setEditid(-1); // Clear the edited row without saving
  };

  const data = React.useMemo(
    () => [
      { Id: 1, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 1", date: "2023-06-15" },
      { Id: 2, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 2", date: "2023-06-16" },
      { Id: 3, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 1", date: "2023-06-15" },
      { Id: 4, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 2", date: "2023-06-16" },
      { Id: 5, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 2", date: "2023-06-16" },
      { Id: 6, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 1", date: "2023-06-15" },
      { Id: 7, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 2", date: "2023-06-16" },
      { Id: 8, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 1", date: "2023-06-15" },
      { Id: 9, name: "John", email: "john@gmail.com", marks: "80/40", group: "Group 2", date: "2023-06-16" },
      { Id: 10, name: "Jane", email: "jane@gmail.com", marks: "70/40", group: "Group 2", date: "2023-06-16" },
      { Id: 1, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 1", date: "2023-06-15" },
      { Id: 2, name: "Sanjeet", email: "san@gmail.com", marks: "60/40", group: "Group 2", date: "2023-06-16" },
      // Add more data objects here if needed
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      { Header: "UID", accessor: "Id" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Marks",
        accessor: "marks",
        Cell: ({ value }) => (
          <div className="flex items-center justify-between">
            <span>{value}</span>
            {value === "60/40" && (
              <Badge
                variant="filled"
                color="success"
                className="ml-2"
                badgeContent="Pass"
              />
            )}
          </div>
        ),
      },
      { Header: "Group", accessor: "group" }, // Add group column
      { Header: "Date", accessor: "date" }, // Add date column
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex justify-center items-center space-x-2">
            {editId === row.original._id ? (
              <>
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
                <button>
                  <BsEye
                    className="transition-all transform hover:scale-150"
                    style={{ fill: "rgb(232, 149, 39)" }}
                  />
                </button>

                <button>
                  <AiOutlineEdit
                    className="transition-all transform hover:scale-150"
                    size={20}
                    style={{ fill: "rgb(98, 200, 224)" }}
                  />
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
      data,
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
      <div className="container px-2 py-1 mb-10 ml-8 max-w-screen-xl shadow-xl shadow-top shadow-left shadow-right shadow-bottom bg-white border border-blue rounded-lg">
        <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1">
          {/* Filter option */}
          <FilterOption pageSize={pageSize} setPageSize={setPageSize} />
          {/* Search field */}
          <SearchFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <div className="px-1 py-2 flex justify-between items-center bg-gradient-to-b py-1 mb-4 pt-3 pr-3">
          <div className='border border-gray-300 rounded-md py-2 px-3 ml-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
            <label className="text-sm">Select Group:</label>
            <select
              className='w-40 ml-1 px-2 border rounded-md'
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              <option value="">All</option>
              <option value="Group 1">Group 1</option>
              <option value="Group 2">Group 2</option>
              <option value="Group 3">Group 3</option>
            </select>
          </div>
          <div className='border border-gray-300 rounded-md py-2 px-3 ml-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md'>
            {/* Filter option 2: Choose date range */}
            <label className='mr-2'>From</label>
            <input
              type="date"
              value={selectedDateRange[0] || ''}
              onChange={(e) => setSelectedDateRange([e.target.value, selectedDateRange[1]])}
              className=" mr-2 border border-gray-300 rounded px-2  focus:outline-none focus:border-blue-500"
            />
            <label className='mr-2'>To</label>
            <input
              type="date"
              value={selectedDateRange[1] || ''}
              onChange={(e) => setSelectedDateRange([selectedDateRange[0], e.target.value])}
              className="border border-gray-300 rounded px-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <table
          className="table-fixed w-full"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}
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
            {applyFilters(page).map((row, index) => {
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
                        className={`px-4 py-2 text-gray-700 text-center ${
                          cell.column.id === "action" ? "text-center" : ""
                        }`}
                      >
                        {cell.column.id === "action" && (
                          <div>
                            {editId === index ? (
                              <div className="space-x-2">
                                <BsEye
                                  className="cursor-pointer"
                                  onClick={() => cancelEdit()}
                                />
                                <AiOutlineEdit
                                  className="cursor-pointer"
                                  onClick={() => cancelEdit()}
                                />
                              </div>
                            ) : (
                              <div>
                                <BsEye
                                  className="cursor-pointer"
                                  onClick={() => setEditid(index)}
                                />
                                <AiOutlineEdit
                                  className="cursor-pointer"
                                  onClick={() => setEditid(index)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {cell.column.id === "status" && (
                          <div>
                            {cell.value === "Active" ? (
                              <Badge variant="dot" color="success" />
                            ) : (
                              <Badge variant="dot" color="error" />
                            )}
                          </div>
                        )}
                        {editId === index ? (
                          <input
                            className="border-none w-full bg-transparent"
                            type="text"
                            defaultValue={cell.value}
                            autoFocus
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
        <Pagination
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </div>
    </>
  );
};

export default Tabel;
