import React from "react";
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:[60vw] px-12 pt-8 pb-12">
        <h2 className="text-xl font-bold text-black-600">LoopShop</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
