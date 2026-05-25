const nodemailer  = require('nodemailer');
const Notification = require('../models/notification.model');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

const sendOrderConfirmationEmail = async (user, order) => {
  const subject = `Order Confirmed — #${order._id}`;
  const html = `
    <h2>Thank you for your order, ${user.name}!</h2>
    <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
    <p>Total: ₹${order.totalPrice}</p>
    <p>We'll notify you when it ships.</p>
    <br/><p>— Elore Jewels Team</p>
  `;
  await sendMail(user.email, subject, html);

  // Log to DB
  await Notification.create({
    user: user._id, type: 'order_confirmed',
    channel: 'email', subject, body: html, status: 'sent',
  });
};

const sendShippingEmail = async (user, order) => {
  const subject = `Your Order Has Shipped — #${order._id}`;
  const html = `
    <h2>Your order is on its way, ${user.name}!</h2>
    <p>Tracking Number: <strong>${order.trackingNumber}</strong></p>
    <br/><p>— Elore Jewels Team</p>
  `;
  await sendMail(user.email, subject, html);

  await Notification.create({
    user: user._id, type: 'shipped',
    channel: 'email', subject, body: html, status: 'sent',
  });
};

module.exports = { sendOrderConfirmationEmail, sendShippingEmail };
