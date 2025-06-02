import express from 'express';
import {
  getAllCategories,
  getAnnoncesByMainCategory,
  getAnnoncesBySubcategory
} from '../controllers/categoryController.js';
import optionalAuth from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// Get all categories with their subcategories
router.get('/', getAllCategories);

// Get all announcements for a main category
router.get('/:category/announcements', optionalAuth, getAnnoncesByMainCategory);

// Get all announcements for a subcategory
router.get('/:category/:subcategory/announcements', optionalAuth, getAnnoncesBySubcategory);

export default router; 