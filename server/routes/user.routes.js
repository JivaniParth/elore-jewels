const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');

const {
  getProfile, updateProfile, addAddress, updateAddress,
  deleteAddress, getWishlist, toggleWishlist,
  getAllUsers, deleteUser,
} = require('../controllers/user.controller');

// Customer routes
router.get   ('/profile',            protect, getProfile);
router.put   ('/profile',            protect, updateProfile);
router.post  ('/address',            protect, addAddress);
router.put   ('/address/:id',        protect, updateAddress);
router.delete('/address/:id',        protect, deleteAddress);
router.get   ('/wishlist',           protect, getWishlist);
router.post  ('/wishlist/:productId',protect, toggleWishlist);

// Admin routes
router.get   ('/',      protect, adminOnly, getAllUsers);
router.delete('/:id',   protect, adminOnly, deleteUser);

module.exports = router;
