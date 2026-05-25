const Category = require('../models/category.model');

const getCategories     = async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort('sortOrder');
  res.json({ success: true, categories: cats });
};
const getCategoryBySlug = async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category: cat });
};
const createCategory    = async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, category: cat });
};
const updateCategory    = async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category: cat });
};
const deleteCategory    = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
