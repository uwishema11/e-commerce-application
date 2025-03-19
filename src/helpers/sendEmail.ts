import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  template: string,
  subject: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const mailOptions = {
      from: `UC E-commerce Team<${process.env.USER_EMAIL}>`,
      to: email,
      subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};
