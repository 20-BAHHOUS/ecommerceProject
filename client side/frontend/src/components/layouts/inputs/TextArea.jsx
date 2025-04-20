import React from "react";

const TextArea = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={props.name}
        className={`block text-sm font-medium ${
          error ? "text-red-500" : "text-gray-700"
        } mb-2`}
      >
        {label}
      </label>
      <div className="mt-1 rounded-md shadow-sm transition-shadow duration-200 focus-within:shadow-md">
        <textarea
          id={props.name}
          rows={4}
          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 ${
            error ? "border-red-500 text-red-500" : ""
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default TextArea;