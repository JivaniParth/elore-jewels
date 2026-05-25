const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Product name is required'], trim: true },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  sku:           { type: String, required: true, unique: true, uppercase: true },
  description:   { type: String, required: true },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory:   { type: String },
  tags:          [{ type: String }],
  material:      { type: String },
  weight:        { type: Number },
  images:        [{ type: String }],
  price:         { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  stock:         { type: Number, required: true, default: 0, min: 0 },
  isFeatured:    { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
  ratings:       { type: Number, default: 0 },
  numReviews:    { type: Number, default: 0 },
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
