const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getProducts, getProductBySlug, createProduct,
  updateProduct, deleteProduct, getFeaturedProducts,
} = require('../controllers/product.controller');

router.get ('/',           getProducts);
router.get ('/featured',   getFeaturedProducts);
router.get ('/:slug',      getProductBySlug);
router.post('/',           protect, adminOnly, createProduct);
router.put ('/:id',        protect, adminOnly, updateProduct);
router.delete('/:id',      protect, adminOnly, deleteProduct);

module.exports = router;
