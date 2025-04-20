import React from "react";
//import { Link } from "react-router-dom";
import Banner from "../../components/layouts/inputs/banner";
//import StyleSearch from "../../components/layouts/inputs/styleSearch";
import CategoryDropdown from "../../components/layouts/inputs/CategoryDropdown";
import Navbar from "../../components/layouts/inputs/Navbar";
const Home = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="fixed top-0 w-full z-1 ">
      <Navbar/>
     <div className= " border border-gray-300 fixed w-full z-10 top-15 flex items-center h-10 justify-between px-4 py-2 bg-white ">
        <CategoryDropdown />
        </div>
        </div>
       
    
      <div className="w-full min-h-[500px] mt-12 bg-white flex items-center justify-center ">
        <Banner />
      </div>
    </div>
  );
};

export default Home;
