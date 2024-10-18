import nodemailer from "nodemailer";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
import { Options } from "nodemailer/lib/mailer";
// import hbs from "nodemailer-express-handlebars";
import Handlebars from "handlebars";
import { ACCOUNT_VERIFICATION_TEMPLATE } from "./constants";

// type ExtendedOptions = Options & {
//   template: string;
//   context: Record<string, unknown>;
// };

dotenv.config();

const SERVICE = process.env.SERVICE;
const USER = process.env.USER;
const PASS = process.env.PASS;

const transporter = nodemailer.createTransport({
  service: SERVICE,
  auth: { user: USER, pass: PASS },
});

// const dirname = fileURLToPath(import.meta.url);

// transporter.use(
//   "compile",
//   hbs({
//     viewEngine: {
//       extname: ".hbs",
//       layoutsDir: path.resolve(path.dirname(dirname), "../templates/"),
//       defaultLayout: "",
//     },
//     viewPath: path.resolve(path.dirname(dirname), "../templates/"),
//     extName: ".hbs",
//   })
// );

export const sendAccVerificationMail = async (
  to: string,
  subject: string,
  username: string,
  verificationLink: string
) => {
  const template = Handlebars.compile(ACCOUNT_VERIFICATION_TEMPLATE);
  const replacement = { username, verificationLink };
  const html = template(replacement);
  const options = {
    from: USER,
    to,
    subject,
    html,
  };
  return transporter.sendMail(options);
};
