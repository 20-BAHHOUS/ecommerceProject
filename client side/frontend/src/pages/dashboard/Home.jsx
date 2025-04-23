import React from "react";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import Navbar from "../../components/layouts/inputs/banner";
import Hero from "../../components/layouts/inputs/hero";
import Header from "../../components/layouts/inputs/header";
const Home = () => (
  <>
  <div className="bg-white sticky top-0 z-50 border-b border-gray-300">
    <Header />
    <MultiLevelNavbar />
    </div>
    
    <Navbar />
    <Hero />
    </>
);

export default Home;
