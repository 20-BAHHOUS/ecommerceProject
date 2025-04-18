import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const ConditionSelector = ({ label, name, options, error, placeholder }) => {
  const { register, setValue } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownRef = useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (value, label) => {
    setSelectedValue(label);
    setValue(name, value);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="mb-6 relative">
      <label
        htmlFor={name}
        className={`block text-sm font-medium ${
          error ? "text-red-500" : "text-gray-700"
        } mb-2`}
      >
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className={`bg-white border border-gray-300 rounded-md shadow-sm w-full py-2 px-3 cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-200 ${
            error ? "border-red-500" : ""
          }`}
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`${name}-options`}
        >
          {selectedValue ? (
            <span className="block truncate">{selectedValue}</span>
          ) : (
            <span className="block truncate text-gray-500">{placeholder}</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "-rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>

        <div
          ref={dropdownRef}
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none origin-top transition-all duration-200 ${
            isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
          id={`${name}-options`}
        >
          <ul
            tabIndex="-1"
            role="listbox"
            aria-labelledby={`${name}-label`}
            aria-activedescendant={`${name}-option-0`}
            className="max-h-48 scroll-py-2 overflow-y-auto py-1"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`text-gray-900 cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 transition-colors duration-150 ${
                  selectedValue === option.label ? "font-semibold bg-indigo-50" : ""
                }`}
                onClick={() => handleSelect(option.value, option.label)}
                role="option"
                aria-selected={selectedValue === option.label}
                id={`${name}-option-${options.indexOf(option)}`}
              >
                <span
                  className={`block truncate ${
                    selectedValue === option.label ? "font-semibold" : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
                {selectedValue === option.label && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.975 3.975 7.475-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error && <p className="mt-1 text-red-500 text-xs italic">{error}</p>}
      <input type="hidden" name={name} {...register(name, { required: true })} value={selectedValue} />
    </div>
  );
};

export default ConditionSelector;