const Notification = require('../models/notification.model');

const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
  res.json({ success: true, notifications });
};

const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find().populate('user', 'name email').sort('-createdAt');
  res.json({ success: true, count: notifications.length, notifications });
};

module.exports = { getMyNotifications, getAllNotifications };
