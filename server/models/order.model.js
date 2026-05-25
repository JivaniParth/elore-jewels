const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:       { type: String, required: true },
  image:      { type: String, required: true },
  sku:        { type: String, required: true },
  quantity:   { type: Number, required: true, min: 1 },
  price:      { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    line1:    { type: String, required: true },
    line2:    { type: String },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pincode:  { type: String, required: true },
    country:  { type: String, default: 'India' },
  },
  paymentMethod:   { type: String, enum: ['stripe', 'cod'], required: true },
  paymentStatus:   { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  stripePaymentId: { type: String },
  itemsPrice:      { type: Number, required: true },
  discountAmount:  { type: Number, default: 0 },
  shippingPrice:   { type: Number, default: 0 },
  totalPrice:      { type: Number, required: true },
  status:          { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  trackingNumber:  { type: String },
  deliveredAt:     { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
