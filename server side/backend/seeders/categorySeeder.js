import mongoose from 'mongoose';
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    icon: 'fa-laptop',
    subcategories: [
      { name: 'Phones & Tablets', description: 'Mobile devices and accessories' },
      { name: 'Computers', description: 'Laptops, desktops, and accessories' },
      { name: 'TV & Audio', description: 'Television and audio equipment' },
      { name: 'Gaming', description: 'Gaming consoles and accessories' }
    ]
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel',
    icon: 'fa-tshirt',
    subcategories: [
      { name: "Men's Clothing", description: "Men's fashion and accessories" },
      { name: "Women's Clothing", description: "Women's fashion and accessories" },
      { name: "Children's Clothing", description: "Kids' fashion and accessories" },
      { name: 'Shoes', description: 'All types of footwear' }
    ]
  },
  {
    name: 'Home & Living',
    description: 'Home furniture and decor',
    icon: 'fa-home',
    subcategories: [
      { name: 'Furniture', description: 'Home and office furniture' },
      { name: 'Home Decor', description: 'Decorative items for your home' },
      { name: 'Kitchen & Dining', description: 'Kitchen appliances and dining items' },
      { name: 'Garden', description: 'Garden tools and outdoor furniture' }
    ]
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    icon: 'fa-futbol',
    subcategories: [
      { name: 'Exercise Equipment', description: 'Fitness and exercise gear' },
      { name: 'Outdoor Sports', description: 'Outdoor sports equipment' },
      { name: 'Camping Gear', description: 'Camping and hiking equipment' },
      { name: 'Sports Clothing', description: 'Athletic wear and accessories' }
    ]
  }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    console.log('Cleared existing categories and subcategories');

    // Create categories and their subcategories
    for (const categoryData of categories) {
      const { subcategories: subcategoriesData, ...categoryFields } = categoryData;
      
      // Create category
      const category = await Category.create({
        ...categoryFields,
        slug: categoryFields.name.toLowerCase().replace(/\s+/g, '-')
      });
      
      // Create subcategories
      const subcategories = await Promise.all(
        subcategoriesData.map(async (subData) => {
          return Subcategory.create({
            ...subData,
            parentCategory: category._id,
            slug: subData.name.toLowerCase().replace(/\s+/g, '-'),
            path: `/${category.slug}/${subData.name.toLowerCase().replace(/\s+/g, '-')}`
          });
        })
      );
      
      console.log(`Created category ${category.name} with ${subcategories.length} subcategories`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCategories(); 