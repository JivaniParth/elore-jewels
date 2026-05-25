const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  title:      { type: String, trim: true },
  comment:    { type: String, required: true },
  images:     [{ type: String }],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Recalculate product rating after save
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const stats = await this.constructor.aggregate([
    { $match: { product: this.product } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      ratings: stats[0].avgRating.toFixed(1),
      numReviews: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
