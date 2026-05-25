const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:    { type: String, enum: ['order_confirmed','shipped','delivered','promo'], required: true },
  channel: { type: String, enum: ['email', 'sms'], required: true },
  subject: { type: String },
  body:    { type: String, required: true },
  status:  { type: String, enum: ['sent', 'failed'], default: 'sent' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
