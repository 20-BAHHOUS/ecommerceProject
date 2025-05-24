import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { TrendingUp, Zap, Shield } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-out",
    });
  }, []);

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Quick Sales",
      description: "List your items and reach thousands of potential buyers instantly"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Zero Fees",
      description: "No hidden charges - keep all your earnings"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Trading",
      description: "Safe and secure transactions for buyers and sellers"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-teal-500 transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
