import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Handlebars from "handlebars";
import { ACCOUNT_VERIFICATION_TEMPLATE } from "./constants";

dotenv.config();

const SERVICE = process.env.SERVICE;
const USER = process.env.USER;
const PASS = process.env.PASS;

const transporter = nodemailer.createTransport({
  service: SERVICE,
  auth: { user: USER, pass: PASS },
});

export const sendAccVerificationMail = async (
  to: string,
  subject: string,
  username: string,
  token: string
) => {
  const template = Handlebars.compile(ACCOUNT_VERIFICATION_TEMPLATE);
  const replacement = { username, token };
  const html = template(replacement);
  const options = {
    from: USER,
    to,
    subject,
    html,
  };
  return transporter.sendMail(options);
};
