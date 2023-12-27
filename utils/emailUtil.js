// utils/emailUtils.js
const nodemailer = require('nodemailer');
require('dotenv').config();

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
  });
}

module.exports = { createTransporter };
