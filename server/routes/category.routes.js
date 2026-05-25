const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getCategories, getCategoryBySlug,
  createCategory, updateCategory, deleteCategory,
} = require('../controllers/category.controller');

router.get ('/',       getCategories);
router.get ('/:slug',  getCategoryBySlug);
router.post('/',       protect, adminOnly, createCategory);
router.put ('/:id',    protect, adminOnly, updateCategory);
router.delete('/:id',  protect, adminOnly, deleteCategory);

module.exports = router;
