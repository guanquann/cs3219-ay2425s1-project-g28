import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const SERVICE = process.env.SERVICE;
const USER = process.env.USER;
const PASS = process.env.PASS;

const Transporter = nodemailer.createTransport({
  service: SERVICE,
  auth: { user: USER, pass: PASS },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const mailOptions = { from: USER, to, subject, text };
    return await Transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};
