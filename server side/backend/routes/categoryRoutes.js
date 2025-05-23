import express from 'express';
import {
  getAllCategories,
  getAnnoncesByMainCategory,
  getAnnoncesBySubcategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Get all categories with their subcategories
router.get('/', getAllCategories);

// Get all announcements for a main category
router.get('/:category/announcements', getAnnoncesByMainCategory);

// Get all announcements for a subcategory
router.get('/:category/:subcategory/announcements', getAnnoncesBySubcategory);

export default router; 