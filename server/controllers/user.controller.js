const User = require('../models/user.model');

const getProfile    = async (req, res) => res.json({ success: true, user: req.user });

const updateProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id, { name, phone, avatar }, { new: true, runValidators: true }
  );
  res.json({ success: true, user });
};

const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
};

const updateAddress = async (req, res) => {
  const user    = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);
  if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
  if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.id);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name slug images price discountPrice');
  res.json({ success: true, wishlist: user.wishlist });
};

const toggleWishlist = async (req, res) => {
  const user      = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index     = user.wishlist.indexOf(productId);
  if (index === -1) user.wishlist.push(productId);
  else              user.wishlist.splice(index, 1);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-refreshToken');
  res.json({ success: true, count: users.length, users });
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
};

module.exports = {
  getProfile, updateProfile, addAddress, updateAddress,
  deleteAddress, getWishlist, toggleWishlist, getAllUsers, deleteUser,
};
