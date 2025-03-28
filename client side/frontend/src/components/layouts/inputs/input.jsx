import React from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="input-box">
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="w-full flex items-center justify-between  border rounded-md px-2 py-1 text-sm">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type == "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                onClick={() => toggleShowPassword()}
                size={22}
                className="text-blue-500 curser-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={() => toggleShowPassword()}
                size={22}
                className="text-state-400 curser-pointer"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
