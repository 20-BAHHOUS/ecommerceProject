import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col flex-grow md:w-[px] p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Loopify</h2>{" "}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
