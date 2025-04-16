import React from "react";
import { Link } from "react-router-dom";
import StyleSearch from "../../components/layouts/inputs/styleSearch";
import Baner from "../../components/layouts/inputs/baner";

const Home = () => {
  return (
    <div className=" ">
      <header className="fixed top-0 left-0 w-full items-center justify-between px-6  bg-white/50 shadow-md">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <div className="text-xl font-bold text-black">LoopShop</div>
          </div>

          <div className="flex items-center w-full max-w-md mx-auto mt-4">
            <StyleSearch />
          </div>

          <div className="flex items-center gap-4 ">
            <Link
              to="/login"
              className=" bg-teal-700 inline-block rounded-sm px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden "
            >
              LOGIN
            </Link>

            <div className="hidden sm:flex">
              <Link
                className="inline-block rounded-sm border px-8 py-3 text-sm font-medium transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden text-teal-800"
                to="/signup"
              >
                SIGNUP
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="pt-16">
        <Baner />
        </div>
     
    </div>
  );
};

export default Home;
