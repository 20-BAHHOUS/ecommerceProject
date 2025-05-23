import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Banner = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 500,
      easing: "ease-in-sine",
    });
  }, []);

  const products = [
    {
      id: 1,
      title: "Resourceful choices.",
      subTitle: "Resourceful choices.",
      image: "/images/cover1.png",
    },
    {
      id: 2,
      title: "Resourceful choices.",
      subTitle: "Resourceful choices.",
      image: "/images/cover2.png",
    },
    {
      id: 3,
      title: "Resourceful choices.",
      subTitle: "Resourceful choices.",
      image: "",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="w-full flex justify-center items-center h-[600x]">
      <Slider {...settings} className="w-full">
        {products?.map((product) => (
          <div key={product?.id} className="w-full">
            {/*baner text */}
            <div className="w-full lg:px-20 px-5 lg:h-[700] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center ">
              <h1
                data-aos="zoom-in"
                data-aos-delay="50"
                className="text-black border rounded-lg border-black px-6 py-2 text-xl"
              >
                {product?.subTitle}
              </h1>
              <h1
                data-aos="zoom-in"
                data-aos-delay="50"
                className="text-6xl text-[#272343] font-inter capitalize leading-16 max-w-[631px] w-full font-bold mb-5"
              >
                Turn Your Clutter <br />
                into Cash
              </h1>
              <h1
                data-aos="zoom-in"
                data-aos-delay="50"
                className="text-black font-semibold"
              >
                description
              </h1>
              <button
                data-aos="zoom-in"
                data-aos-delay="200"
                className="bg-teal-500 px-6 py-3 rounded-lg text-black font-semibold"
              >
                <Link to="/postad">Sell Now</Link>
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default Banner;

