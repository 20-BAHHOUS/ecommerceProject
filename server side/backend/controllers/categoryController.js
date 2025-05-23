import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Annonce from "../models/annonce.js";

// Get all categories with their subcategories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort('order')
      .populate({
        path: 'subcategories',
        match: { isActive: true },
        options: { sort: { order: 1 } }
      });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get all announcements for a main category
export const getAnnoncesByMainCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log('Fetching announcements for category:', category);
    
    // Find the category by slug
    const categoryDoc = await Category.findOne({ 
      slug: category.toLowerCase(),
      isActive: true
    });

    if (!categoryDoc) {
      console.log('Category not found:', category);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    console.log('Found category:', categoryDoc);

    // Find all announcements in this category
    const annonces = await Annonce.find({
      category: categoryDoc._id
    })
    .populate('createdBy', 'fullName email profileImageUrl')
    .populate('category')
    .populate('subcategory')
    .sort({ createdAt: -1 });

    console.log(`Found ${annonces.length} announcements for category:`, categoryDoc.name);

    res.status(200).json({
      success: true,
      count: annonces.length,
      data: annonces
    });
  } catch (error) {
    console.error('Error fetching category annonces:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements for this category',
      error: error.message
    });
  }
};

// Get all announcements for a subcategory
export const getAnnoncesBySubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    console.log('Fetching announcements for category/subcategory:', { category, subcategory });
    
    // Find the category and subcategory by slug
    const categoryDoc = await Category.findOne({ 
      slug: category.toLowerCase(),
      isActive: true
    });

    if (!categoryDoc) {
      console.log('Category not found:', category);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subcategoryDoc = await Subcategory.findOne({
      slug: subcategory.toLowerCase(),
      parentCategory: categoryDoc._id,
      isActive: true
    });

    if (!subcategoryDoc) {
      console.log('Subcategory not found:', subcategory);
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    console.log('Found category/subcategory:', {
      category: categoryDoc.name,
      subcategory: subcategoryDoc.name
    });

    // Find all announcements in this subcategory
    const annonces = await Annonce.find({
      category: categoryDoc._id,
      subcategory: subcategoryDoc._id
    })
    .populate('createdBy', 'fullName email profileImageUrl')
    .populate('category')
    .populate('subcategory')
    .sort({ createdAt: -1 });

    console.log(`Found ${annonces.length} announcements for subcategory:`, subcategoryDoc.name);

    res.status(200).json({
      success: true,
      count: annonces.length,
      data: annonces
    });
  } catch (error) {
    console.error('Error fetching subcategory annonces:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements for this subcategory',
      error: error.message
    });
  }
};