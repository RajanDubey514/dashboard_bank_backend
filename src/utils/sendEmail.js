import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log("SENDGRID KEY:", process.env.SENDGRID_API_KEY ? "FOUND" : "MISSING");

export const sendEmail = async ({ to, subject, text }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_USER,
      subject,
      text,
    });
  } catch (error) {
    console.log(error , "fffff")
    console.log("Email Error:", error.response?.body || error.message);
    throw new Error("Email not sent");
  }
};