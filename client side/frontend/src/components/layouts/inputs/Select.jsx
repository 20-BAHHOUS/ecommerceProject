const Select = ({ options, defaultOption, label, error, ...props }) => {
    return (
      <div>
        <label
          className={`text-sm font-semibold
            ${error ? "text-red-500" : "text-slate-800"}
            `}
        >
          {label}
        </label>
        <select
          className={`w-full border rounded-md px-2 py-3 text-sm outline-none
              ${
                error ? "border-red-500 text-red-500" : "border-slate-300"
              } focus-within:border-blue-500
              `}
          {...props}
        >
          <option value="" hidden>
            {defaultOption}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-red-500 text-xs italic">{error}</span>}
      </div>
    );
  };
  
  
  export default Select;
  