import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    name: "Women",
    subcategories: [
      { name: "Clothes", path: "/women/clothes" },
      { name: "Shoes", path: "/women/shoes" },
      { name: "Accessories", path: "/women/accessories" },
    ],
  },
  {
    name: "Men",
    subcategories: [
      { name: "Clothes", path: "/men/clothes" },
      { name: "Shoes", path: "/men/shoes" },
      { name: "Accessories", path: "/men/accessories" },
    ],
  },
  { name: "Electronics", subcategories: [], path: "/electronics" },
  { name: "Home & Garden", subcategories: [], path: "/home-garden" },
  { name: "Books & Media", subcategories: [], path: "/books-media" },
];

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return React.createElement(
    "div",
    { ref: containerRef, className: "relative inline-block" },
    React.createElement(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className:
          "flex items-center gap-2 text-gray-700 hover:text-teal-600 font-medium py-2 px-4 rounded-md focus:outline-none",
      },
      React.createElement("span", null, "All Categories"),
      React.createElement(ChevronDown, { size: 16 })
    ),

    isOpen &&
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2 },
          className:
            "absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10",
        },
        categories.map((category) =>
          React.createElement(
            "div",
            {
              key: category.name,
              className: "relative",
              onMouseEnter: () => setActiveCategory(category.name),
              onMouseLeave: () => setActiveCategory(null),
            },
            React.createElement(
              Link,
              {
                to: category.path || "#",
                className:
                  "block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-teal-600 whitespace-nowrap",
              },
              category.name
            ),
            category.subcategories?.length > 0 &&
              activeCategory === category.name &&
              React.createElement(
                motion.div,
                {
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: -10 },
                  transition: { duration: 0.1 },
                  className:
                    "absolute left-full top-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20",
                },
                category.subcategories.map((sub) =>
                  React.createElement(
                    Link,
                    {
                      key: sub.name,
                      to: sub.path,
                      className:
                        "block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-teal-600 whitespace-nowrap",
                    },
                    sub.name
                  )
                )
              )
          )
        )
      )
  );
};

export default CategoryDropdown;