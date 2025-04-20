import React from "react";
import { Link } from "react-router-dom";
const Baner = () => {
  return (
    <section className="bg-gradient-to-r from-teal-500 to-cyan-500 py-16 rounded-xl shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-teal-600 opacity-10 rounded-xl"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left md:w-1/2">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Unlock Great Deals and Sell Your Stuff Easily
            </h2>
            <p className="mt-4 text-lg text-teal-100 leading-relaxed hidden md:block">
              Join our vibrant community where you can discover fantastic
              second-hand treasures and effortlessly turn your unused items into
              cash. Experience secure and seamless buying, selling, and trading.
            </p>
            <div className="mt-8">
              <Link
                to="/postad"
                className="inline-block bg-white text-teal-500 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-teal-100 transition-all duration-300"
              >
                Start Selling
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            {/* You can add a relevant image here */}
            <img
              src="https://via.placeholder.com/400"
              alt="Shop Smart"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Baner;
