const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getMyNotifications, getAllNotifications } = require('../controllers/notification.controller');

router.get('/',    protect, adminOnly, getAllNotifications);
router.get('/my',  protect, getMyNotifications);

module.exports = router;
