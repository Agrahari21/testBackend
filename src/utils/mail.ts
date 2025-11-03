import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Boolean(process.env.SECURE),
  service: process.env.SERVICE,
  auth: {
    user: "rajesh." + process.env.USER,
    pass: "qlfe" + process.env.PASS,
  },
});

const sendVerification = async (email: string, link: string) => {
  await transport.sendMail({
    from: "verification@myapp.com",
    subject: "Food Planner - User Verification",
    to: email,
    html: `<h1>Please click on <a href="${link}">this link </a> to verify your account </h1>`,
  });
};

const sendPassResetLink = async (email: string, link: string) => {
  await transport.sendMail({
    from: "security@myapp.com",
    to: email,
    subject: "Food Planner - Password Reset Link",
    html: `<h1>Please click on <a href="${link}">this link </a> to update your password`,
  });
};

const sendPasswordResetMessage = async (email: string) => {
  await transport.sendMail({
    from: "security@myapp.com",
    to: email,
    subject: "Food Planner - Password Reset status",
    html: `<h1>Your password is updated, you can use your new password</h1>`,
  });
};

const mail = {
  sendVerification,
  sendPassResetLink,
  sendPasswordResetMessage,
};

export default mail;
