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
      title: "Turn Your Items into Opportunities",
      subTitle: "Start Selling Today",
      description: "Join thousands of sellers who've found success on our platform",
      image: "/images/cover1.png",
    },
    {
      id: 2,
      title: "Find Amazing Deals",
      subTitle: "Shop Smart",
      description: "Discover unique items at unbeatable prices",
      image: "/images/cover2.png",
    },
    {
      id: 3,
      title: "Safe and Secure Trading",
      subTitle: "Trade with Confidence",
      description: "Our platform ensures secure transactions every time",
      image: "/images/cover3.png",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
        <ul className="flex justify-center items-center m-0 p-0">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200" />
    ),
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-r from-teal-900 to-teal-700 overflow-hidden">
      <Slider {...settings} className="h-full">
        {products?.map((product) => (
          <div key={product?.id} className="relative h-[600px]">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${product.image})`,
                opacity: '0.3'
              }}
            />
            
            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl" data-aos="fade-up">
                {/* Subtitle */}
                <span
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-white bg-teal-600 rounded-full"
                >
                  {product.subTitle}
                </span>

                {/* Title */}
                <h1
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight"
                >
                  {product.title}
                </h1>

                {/* Description */}
                <p
                  data-aos="fade-up"
                  data-aos-delay="300"
                  className="text-xl text-white/90 mb-8"
                >
                  {product.description}
                </p>

                {/* CTA Buttons */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="400"
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to="/postad"
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-teal-900 bg-white rounded-lg hover:bg-teal-50 transition-colors duration-300"
                  >
                    Start Selling
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link
                    to="/home"
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-300"
                  >
                    Browse Items
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;

