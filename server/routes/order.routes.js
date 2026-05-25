const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, createStripeIntent,
} = require('../controllers/order.controller');

router.post('/stripe-intent',   protect, createStripeIntent);
router.post('/',                protect, createOrder);
router.get ('/my',              protect, getMyOrders);
router.get ('/:id',             protect, getOrderById);
router.get ('/',                protect, adminOnly, getAllOrders);
router.put ('/:id/status',      protect, adminOnly, updateOrderStatus);

module.exports = router;
