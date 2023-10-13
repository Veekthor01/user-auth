import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const email = process.env.EMAIL_HOST_USER;
const appPassword = process.env.EMAIL_HOST_APP_PASSWORD;

const emailConfig = {
  service: 'Gmail', // Example: 'Gmail' for Gmail
  auth: {
    user: email, // Your email address
    pass: appPassword, // Your password
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = createTransport(emailConfig);

export default transporter;