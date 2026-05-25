const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getProductReviews, createReview, deleteReview,
} = require('../controllers/review.controller');

router.get   ('/:productId',   getProductReviews);
router.post  ('/:productId',   protect, createReview);
router.delete('/:id',          protect, adminOnly, deleteReview);

module.exports = router;
