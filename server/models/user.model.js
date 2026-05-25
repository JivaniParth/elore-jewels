const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    { type: String },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
  country:  { type: String, default: 'India' },
  isDefault:{ type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name:         { type: String, required: [true, 'Name is required'], trim: true },
  email:        { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password:     { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role:         { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone:        { type: String },
  avatar:       { type: String },
  addresses:    [addressSchema],
  wishlist:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isVerified:   { type: Boolean, default: false },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password to hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
