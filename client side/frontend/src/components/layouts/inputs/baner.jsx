import React from "react";
import { Link } from "react-router-dom";
const Baner = () => {
  return (
    <section className=" px-15 bg-cover bg-top bg-no-repeat">
      <div className="w-full bg-gradient-to-r from-[#2A2D7c] to-[#00c897] py-20 px-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center mt-4   ">
        <div className="text-center md:text-left max-w-xl">
          <h2 className=" font-bold text-3xl md:text-left mb-4 text-white">
            Save big-shop smart
          </h2>

          <p className="hidden max-w-lg text-white md:mt-6 md:block md:text-lg md:leading-relaxed ">
            Join the movement where second-hand means first-class! turn your
            unused items into cash.Descover deals, buy, or trade easeily in
            secure.
          </p>

          <div className="mt-4 sm:mt-8">
            <Link
              to="/postad"
              className="inline-block rounded-full bg-white px-12 py-3 text-sm font-medium text-[#007b92] transition hover:scale-110 hover:shadow-xl 
              focus:ring-3 focus:outline-hidden"
            >
              Sell now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Baner;
