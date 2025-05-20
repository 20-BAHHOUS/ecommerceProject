import React from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const Input = ({
  value,
  onChange,
  placeholder,
  label,
  type,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label
        className={`text-sm font-medium ${
          error ? "text-red-500" : "text-slate-800"
        }`}
      >
        {label}
      </label>

      <div
        className={`w-full flex items-center justify-between border rounded-md px-2 py-3 text-sm ${
          error ? "border-red-500 text-red-500" : "border-slate-300"
        }
      focus-within:border-blue-500`}
      >
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
          {...props}
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                onClick={() => toggleShowPassword()}
                size={22}
                className="text-green-700 cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={() => toggleShowPassword()}
                size={22}
                className="text-slate-400 cursor-pointer"
              />
            )}
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm italic">{error}</p>}
    </div>
  );
};

export default Input;
