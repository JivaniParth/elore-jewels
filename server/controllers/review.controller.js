const Review = require('../models/review.model');
const Order  = require('../models/order.model');

const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar').sort('-createdAt');
  res.json({ success: true, count: reviews.length, reviews });
};

const createReview = async (req, res) => {
  const { rating, title, comment, images } = req.body;
  const productId = req.params.productId;

  // Check if user actually bought the product
  const purchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    paymentStatus: 'paid',
  });

  const review = await Review.create({
    product: productId, user: req.user._id,
    rating, title, comment, images,
    isVerified: !!purchased,
  });

  res.status(201).json({ success: true, review });
};

const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
};

module.exports = { getProductReviews, createReview, deleteReview };
