import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { models } from '../utils/db.js';

dotenv.config();

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });
  return transporter;
}

export async function sendEmail(to, subject, text) {
  const t = getTransporter();
  if (!t) return;
  const from = process.env.SMTP_FROM || 'DFET <no-reply@example.com>';
  await t.sendMail({ from, to, subject, text });
}

export async function sendExpiryEmail(userId, message) {
  const t = getTransporter();
  if (!t) return;
  const user = await models.User.findByPk(userId);
  if (!user?.email) return;
  await sendEmail(user.email, 'DFET Expiry Alert', message);
}