const Order   = require('../models/order.model');
const Product = require('../models/product.model');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendOrderConfirmationEmail } = require('../utils/mailer');

const createStripeIntent = async (req, res) => {
  const { amount } = req.body; // amount in paise (INR)
  const intent = await stripe.paymentIntents.create({
    amount, currency: 'inr',
    metadata: { userId: req.user._id.toString() },
  });
  res.json({ success: true, clientSecret: intent.client_secret });
};

const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, stripePaymentId, shippingPrice = 0, discountAmount = 0 } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  // Build items with price snapshot + deduct stock
  let itemsPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
    }
    const unitPrice = product.discountPrice || product.price;
    itemsPrice += unitPrice * item.quantity;
    orderItems.push({
      product: product._id, name: product.name,
      image: product.images[0], sku: product.sku,
      quantity: item.quantity, price: unitPrice,
      totalPrice: unitPrice * item.quantity,
    });
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
  }

  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  const order = await Order.create({
    user: req.user._id, items: orderItems, shippingAddress,
    paymentMethod, stripePaymentId,
    paymentStatus: stripePaymentId ? 'paid' : 'pending',
    itemsPrice, discountAmount, shippingPrice, totalPrice,
  });

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail(req.user, order).catch(() => {});

  res.status(201).json({ success: true, order });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, orders });
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorised' });
  }
  res.json({ success: true, order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json({ success: true, count: orders.length, orders });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, ...(status === 'delivered' && { deliveredAt: new Date() }) },
    { new: true }
  );
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
};

module.exports = { createStripeIntent, createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
