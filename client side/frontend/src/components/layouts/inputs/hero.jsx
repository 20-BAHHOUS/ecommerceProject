import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
const Hero = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 500,
      easing: "ease-in-sine",
    });
  }, []);

  return (
    <div data-aos="zoom-in" data-aos-delay="100" className="w-full lg:px-20 px-5 py-[80px]  justify-center  gap-10">
      <div
        className="relative flex items-center gap-6 bg-cover bg-center p-25 rounded-lg"
        style={{ backgroundImage:  `url(${"/images/coverBaner.jpg"})` }}
      >
        <div className="p-9">
          <div className="absolute top-2 left-2 bg-white text-teal-700 text-xs font-semibold  px-2 py-2">
            <div className=" text-xl font-semibold">NEW</div>

            <h2 className="text-black text-lg font-semibold mb-2">
              Sell electronics with no fees
            </h2>
          </div>
          <div className=""></div>
          <button className="bg-teal-700 py-2 px-4 absolute left-2 text-black font-semibold rounded-lg  text-sm cursor-pointer">
            <Link to="/postad">Start earning </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
