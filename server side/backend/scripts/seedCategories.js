import mongoose from 'mongoose';
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories",
    subcategories: [
      { name: "All Electronics", path: "/category/electronics" },
      { name: "Phones & Accessories", path: "/category/electronics/phones" },
      { name: "Laptops & Computers", path: "/category/electronics/computers" },
      { name: "Gaming & Consoles", path: "/category/electronics/gaming" },
      { name: "Cameras & Photography", path: "/category/electronics/cameras" },
      { name: "Audio & Headphones", path: "/category/electronics/audio" },
      { name: "Smart Home Devices", path: "/category/electronics/smart-home" },
      { name: "Wearable Technology", path: "/category/electronics/wearables" }
    ]
  },
  {
    name: "Clothing",
    description: "Fashion and apparel",
    subcategories: [
      { name: "All Clothing", path: "/category/clothing" },
      { name: "Men's Fashion", path: "/category/clothing/mens" },
      { name: "Women's Fashion", path: "/category/clothing/womens" },
      { name: "Kids' Fashion", path: "/category/clothing/kids" },
      { name: "Shoes", path: "/category/clothing/shoes" },
      { name: "Accessories", path: "/category/clothing/accessories" },
      { name: "Jewelry & Watches", path: "/category/clothing/jewelry" }
    ]
  },
  {
    name: "Home & Living",
    description: "Home decor and furniture",
    subcategories: [
      { name: "All Home", path: "/category/home" },
      { name: "Furniture", path: "/category/home/furniture" },
      { name: "Home Decor", path: "/category/home/decor" },
      { name: "Kitchen & Dining", path: "/category/home/kitchen" },
      { name: "Bath", path: "/category/home/bath" },
      { name: "Lighting", path: "/category/home/lighting" },
      { name: "Storage & Organization", path: "/category/home/storage" }
    ]
  },
  {
    name: "Sports & Outdoors",
    description: "Sports equipment and outdoor gear",
    subcategories: [
      { name: "All Sports", path: "/category/sports" },
      { name: "Exercise & Fitness", path: "/category/sports/fitness" },
      { name: "Outdoor Recreation", path: "/category/sports/outdoor" },
      { name: "Sports Equipment", path: "/category/sports/equipment" },
      { name: "Athletic Clothing", path: "/category/sports/clothing" },
      { name: "Camping & Hiking", path: "/category/sports/camping" }
    ]
  },
  {
    name: "Toys & Games",
    description: "Toys, games, and entertainment items",
    subcategories: [
      { name: "All Toys", path: "/category/toys" },
      { name: "Action Figures", path: "/category/toys/action-figures" },
      { name: "Board Games", path: "/category/toys/board-games" },
      { name: "Educational Toys", path: "/category/toys/educational" },
      { name: "Arts & Crafts", path: "/category/toys/arts-crafts" },
      { name: "Outdoor Toys", path: "/category/toys/outdoor" }
    ]
  },
  {
    name: "Beauty & Health",
    description: "Beauty, personal care, and health products",
    subcategories: [
      { name: "All Beauty", path: "/category/beauty" },
      { name: "Skincare", path: "/category/beauty/skincare" },
      { name: "Makeup", path: "/category/beauty/makeup" },
      { name: "Hair Care", path: "/category/beauty/hair" },
      { name: "Fragrances", path: "/category/beauty/fragrances" },
      { name: "Personal Care", path: "/category/beauty/personal-care" },
      { name: "Health Care", path: "/category/beauty/health" }
    ]
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await Category.deleteMany({});
    await Subcategory.deleteMany({});

    // Create categories and their subcategories
    for (const categoryData of categories) {
      const category = await Category.create({
        name: categoryData.name,
        description: categoryData.description
      });

      // Create subcategories for this category
      const subcategories = categoryData.subcategories.map((sub, index) => ({
        name: sub.name,
        parentCategory: category._id,
        path: sub.path,
        order: index
      }));

      await Subcategory.insertMany(subcategories);
    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedCategories(); 