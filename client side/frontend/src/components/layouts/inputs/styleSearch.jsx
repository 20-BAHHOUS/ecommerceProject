import React from 'react';

const StyleSearch = () => {
  return (
    <form className="flex  border-1 border-gray-700 rounded-md shadow text-gray-700 text-sm ">
      <div aria-disabled="true" className="text-gray-700 w-10 grid place-content-center ">
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={11} cy={11} r={8} />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input type="text" spellCheck="false" name="text" className="bg-transparent py-1.5 outline-none placeholder:text-zinc-400 w-20 focus:w-48 transition-all" placeholder="Search..." />
      <button className="text-gray-700 w-10 grid place-content-center " aria-label="Clear input button" type="reset">
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </form>
  );
  
}

export default StyleSearch;