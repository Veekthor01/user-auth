const { createTransport } = require('nodemailer');
require('dotenv').config();

const email = process.env.EMAIL_HOST_USER;
const appPassword = process.env.EMAIL_HOST_APP_PASSWORD;

const emailConfig = {
  service: 'Gmail',
  auth: {
    user: email,
    pass: appPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = createTransport(emailConfig);

module.exports = transporter;
