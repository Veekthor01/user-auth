import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const email = process.env.EMAIL_HOST_USER;
const password = process.env.EMAIL_HOST_PASSWORD;

const emailConfig = {
  service: 'Gmail', // Example: 'Gmail' for Gmail
  auth: {
    user: email, // Your email address
    pass: password, // Your password
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = createTransport(emailConfig);

export default transporter;
