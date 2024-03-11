import React from "react";

const FilterOption = ({ pageSize, setPageSize }) => {
    return (
        <div className="flex items-center">
            <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md py-2 px-3 ml-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
                style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }}
            >
                {[5, 10, 20, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterOption;