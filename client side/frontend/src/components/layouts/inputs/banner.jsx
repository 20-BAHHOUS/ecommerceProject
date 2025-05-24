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
      duration: 800,
      easing: "ease-in-out",
    });
  }, []);

  const products = [
    {
      id: 1,
      title: "Turn Your Clutter into Cash",
      subTitle: "Start Selling Today",
      description: "List your items and reach thousands of potential buyers",
      image: "/images/cover1.png",
      buttonText: "Start Selling",
      theme: "purple",
    },
    {
      id: 2,
      title: "Find Amazing Deals",
      subTitle: "Shop Smart",
      description: "Discover great deals on quality second-hand items",
      image: "/images/cover2.png",
      buttonText: "Shop Now",
      theme: "indigo",
    },
    {
      id: 3,
      title: "Join Our Community",
      subTitle: "Connect & Trade",
      description: "Be part of our growing community of buyers and sellers",
      image: "/images/cover3.png",
      buttonText: "Join Now",
      theme: "rose",
    },
  ];

  const getThemeClasses = (theme) => {
    const themes = {
      purple: {
        bg: "bg-purple-900/95",
        accent: "bg-purple-500",
        text: "text-purple-300",
        border: "border-purple-400/30",
        button: "from-purple-500 to-fuchsia-600",
        buttonHover: "from-purple-600 to-fuchsia-700",
        shadow: "shadow-purple-500/50",
      },
      indigo: {
        bg: "bg-indigo-900/95",
        accent: "bg-indigo-500",
        text: "text-indigo-300",
        border: "border-indigo-400/30",
        button: "from-indigo-500 to-blue-600",
        buttonHover: "from-indigo-600 to-blue-700",
        shadow: "shadow-indigo-500/50",
      },
      rose: {
        bg: "bg-rose-900/95",
        accent: "bg-rose-500",
        text: "text-rose-300",
        border: "border-rose-400/30",
        button: "from-rose-500 to-pink-600",
        buttonHover: "from-rose-600 to-pink-700",
        shadow: "shadow-rose-500/50",
      },
    };
    return themes[theme];
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    customPaging: () => (
      <div className="w-2 h-8 mx-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"></div>
    ),
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[600px] bg-gray-900">
      <Slider {...settings} className="w-full">
        {products?.map((product) => {
          const theme = getThemeClasses(product.theme);
          return (
            <div key={product?.id} className="w-full">
              <div className="w-full lg:px-20 px-5 lg:h-[700px] h-[600px] relative overflow-hidden">
                {/* Geometric Background Elements */}
                <div className="absolute inset-0">
                  <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
                  <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"></div>
                </div>
                
                {/* Content Container */}
                <div className="relative h-full flex lg:flex-row flex-col items-center justify-between gap-8 z-10">
                  {/* Text Content */}
                  <div className="lg:w-1/2 w-full flex flex-col justify-center lg:items-start items-center lg:text-left text-center">
                    <div 
                      data-aos="fade-right"
                      className="flex flex-col gap-6 p-8 rounded-2xl backdrop-blur-xl bg-black/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-2 rounded-full ${theme.accent}`}></div>
                        <h2 className={`${theme.text} text-xl font-medium`}>
                          {product.subTitle}
                        </h2>
                      </div>
                      
                      <h1 className="text-5xl lg:text-6xl text-white font-bold leading-tight">
                        {product.title}
                      </h1>
                      
                      <p className="text-gray-300 text-lg max-w-xl">
                        {product.description}
                      </p>
                      
                      <button
                        className={`bg-gradient-to-r ${theme.button} hover:${theme.buttonHover} 
                          transition-all duration-300 px-8 py-4 rounded-xl text-white font-semibold 
                          text-lg shadow-lg hover:shadow-xl hover:scale-105 hover:${theme.shadow} 
                          flex items-center justify-center gap-3 w-fit`}
                      >
                        <Link to="/postad">{product.buttonText}</Link>
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Image/Visual Section */}
                  <div 
                    data-aos="fade-left"
                    className="lg:w-1/2 w-full h-full relative flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-lg aspect-square">
                      <div className={`absolute inset-0 rounded-3xl ${theme.bg} transform rotate-6`}></div>
                      <div className={`absolute inset-0 rounded-3xl ${theme.bg} transform -rotate-6`}></div>
                      <div className="relative rounded-2xl overflow-hidden border-4 border-white/10">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Banner;

