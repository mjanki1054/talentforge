import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchFilter = ({ globalFilter, setGlobalFilter }) => {
    return (
        <div className="flex items-center justify-between mb-4 mt-2 pt-3 pr-3">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>

                <input
                    type="text"
                    placeholder="Search..."
                    value={globalFilter || ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-md"
                />
            </div>
        </div>
    );
};

export default SearchFilter;