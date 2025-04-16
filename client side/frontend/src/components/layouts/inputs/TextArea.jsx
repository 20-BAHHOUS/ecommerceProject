const TextArea = ({ label, error, ...props }) => {
    return (
      <div>
        <label
          className={`text-sm font-semibold
          ${error ? "text-red-500" : "text-slate-800"}
          `}
        >
          {label}
        </label>
        <textarea
          className={`w-full border rounded-md px-2 py-3 text-sm outline-none
          ${
            error ? "border-red-500 text-red-500" : "border-slate-300"
          } focus-within:border-blue-500
          `}
          placeholder="ex : worn a few times , fits well"
          {...props}
        ></textarea>
        {error && <span className="text-red-500 text-xs italic">{error}</span>}
      </div>
    );
  };
  
  
  export default TextArea;
  