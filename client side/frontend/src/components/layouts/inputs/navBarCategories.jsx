import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const categoryData = [
  {
    name: "Women",
    subcategories: [
      { name: "All Women", path: "/" },
      { name: "Clothing", path: "/" },
      { name: "Shoes", path: "/" },
      { name: "Bags", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Beauty", path: "/" },
    ],
  },
  {
    name: "Men",
    subcategories: [
      { name: "All Men", path: "/" },
      { name: "Clothing", path: "/" },
      { name: "Shoes", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Grooming", path: "/" },
    ],
  },

  {
    name: "Kids",
    subcategories: [
      { name: "All Kids", path: "/" },
      { name: "Girls clothing", path: "/" },
      { name: "Boys clothing", path: "/" },
      { name: "Toys", path: "/" },
      { name: "Pushchairs, carriers & car seats", path: "/" },
      { name: "Bicycles & ride-on toys", path: "/" },
      { name: "Furniture & decor", path: "/" },
      { name: "Bathing & changing", path: "/" },
      { name: "Childproofing & safety equipment", path: "/" },
      { name: "Health & pregnancy", path: "/" },
      { name: "Nursing & feeding", path: "/" },
      { name: "Sleep & bedding", path: "/" },
      { name: "School supplies", path: "/" },
      { name: "Other kids' items", path: "/" },
    ],
  },
  {
    name: "Home",
    subcategories: [
      { name: "All Home", path: "/" },
      { name: "Tableware", path: "/" },
      { name: "Textiles", path: "/" },
      { name: "Home accessories", path: "/" },
      {
        name: "Celebrations & holidays",
        path: "/",
      },
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      { name: "All Electronics", path: "/" },
      { name: "Video games & consoles", path: "/" },
      { name: "Laptops", path: "/" },
      { name: "Computer accessories", path: "/" },
      { name: "Mobile phones", path: "/" },
      { name: "Headphones & earbuds", path: "/" },
      { name: "Portable radios & speakers", path: "/" },
      { name: "Handheld music players", path: "/" },
      { name: "Cameras & accessories", path: "/" },
      { name: "Tablets", path: "/" },
      { name: "e-Readers", path: "/" },
      { name: "Streaming devices", path: "/" },
      { name: "Wearables", path: "/" },
      { name: "Smart home devices", path: "/" },
      { name: "GPS & satellite navigation", path: "/" },
    ],
  },
  {
    name: "Entertainment",
    subcategories: [
      { name: "All Entertainment", path: "/" },
      { name: "Trading cards", path: "/" },
    ],
  },
];

const MultiLevelNavbar = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const topLevelRef = useRef(null);
  const secondLevelRef = useRef(null);

  const handleMouseEnterTopLevel = (categoryName) => {
    setHoveredCategory(categoryName);
    setHoveredSubcategory(null); 
  };

  const handleMouseLeaveTopLevel = () => {
    setTimeout(() => {
      if (
        topLevelRef.current &&
        !topLevelRef.current.contains(document.activeElement) &&
        secondLevelRef.current &&
        !secondLevelRef.current.contains(document.activeElement)
      ) {
        setHoveredCategory(null);
      }
    }, 200);
  };

  const handleMouseEnterSecondLevel = (subcategoryName) => {
    setHoveredSubcategory(subcategoryName);
  };

  const handleMouseLeaveSecondLevel = () => {
    setTimeout(() => {
      if (
        secondLevelRef.current &&
        !secondLevelRef.current.contains(document.activeElement)
      ) {
        setHoveredSubcategory(null);
      }
    }, 200);
  };

  return (
    <nav className="">
      <div className="container mx-auto px-4">
        <ul ref={topLevelRef} className="flex items-center space-x-6 ">
          {categoryData.map((category) => (
            <li
              key={category.name}
              className="relative"
              onMouseEnter={() => handleMouseEnterTopLevel(category.name)}
              onMouseLeave={handleMouseLeaveTopLevel}
            >
              {category.subcategories ? (
                <>
                  <div className="cursor-pointer text-gray-700 hover:text-teal-500 font-semibold py-2 px-3 transition duration-300">
                    {category.name}
                  </div>
                  {hoveredCategory === category.name && (
                    <ul
                      ref={secondLevelRef}
                      className="absolute left-0 mt-2 bg-white rounded-md shadow-xl z-20 py-2"
                      onMouseEnter={() =>
                        handleMouseEnterTopLevel(category.name)
                      } 
                      onMouseLeave={handleMouseLeaveTopLevel} 
                    >
                      {category.subcategories.map((subcategory) => (
                        <li
                          key={subcategory.name}
                          className="relative"
                          onMouseEnter={() =>
                            handleMouseEnterSecondLevel(subcategory.name)
                          }
                          onMouseLeave={handleMouseLeaveSecondLevel}
                        >
                          {subcategory.subSubcategories ? (
                            <>
                              <div className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                                {subcategory.name}
                                <span className="ml-2">&gt;</span>{" "}
                               
                              </div>
                              {hoveredSubcategory === subcategory.name && (
                                <ul className="absolute left-full top-0 mt-0 bg-white rounded-md shadow-xl z-30 py-2 w-48">
                                  {subcategory.subSubcategories.map(
                                    (subSubcategory) => (
                                      <li key={subSubcategory.name}>
                                        <Link
                                          to={subSubcategory.path}
                                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                        >
                                          {subSubcategory.name}
                                        </Link>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              to={subcategory.path}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                            >
                              {subcategory.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={category.path}
                  className="text-gray-700 hover:text-teal-500 font-semibold py-2 px-3 transition duration-300"
                >
                  {category.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MultiLevelNavbar;
