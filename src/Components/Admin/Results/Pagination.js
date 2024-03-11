import React from "react";

const Pagination = ({
    pageIndex,
    pageOptions,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
}) => {
    return (
        <div className="flex justify-end mt-4">
            <div>
                <span className="mr-4">
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold mr-2 disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {"<<"}
                </button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold mr-2 disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold mr-2 disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {">"}
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {">>"}
                </button>
            </div>
        </div>
    );
};

export default Pagination;