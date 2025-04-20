import React from "react";
const StyleSearch = () => {
  return (
    <form className="flex items-center rounded-lg shadow-md border border-gray-200 overflow-hidden w-full max-w-md">
      <div className="pl-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search for items..."
        className="py-2 px-4 w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline"
      />
      <button
        type="reset"
        className="text-gray-400 hover:text-gray-600 focus:outline-none pr-3"
        aria-label="Clear search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </form>
  );
};

export default StyleSearch;