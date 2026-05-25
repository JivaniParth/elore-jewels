const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadImage, deleteImage } = require('../controllers/upload.controller');

router.post  ('/', protect, adminOnly, uploadImage);
router.delete('/', protect, adminOnly, deleteImage);

module.exports = router;
