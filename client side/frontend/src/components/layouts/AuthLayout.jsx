import React from "react";
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">LoopShop</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
