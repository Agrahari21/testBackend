import { RequestHandler } from "express";
import User from "src/config/models/User";
import { sendErrorRes } from "src/utils/helper";
import crypto from "crypto";
import nodemailer from "nodemailer";
import AuthVerifyToken from "src/config/models/AuthVerifyToken";
import jwt from "jsonwebtoken";
import mail from "src/utils/mail";
import PassResetToken from "src/config/models/PassResetToken";
import { genSalt, hash } from "bcrypt";
import Profile from "src/config/models/Profile";

const VERIFICATION_LINK = process.env.VERIFICATION_LINK!;
const JWT_SECRET = process.env.JWT_SECRET!;
const PASSWORD_RESET_LINK = process.env.PASSWORD_RESET_LINK!;

export const resendVerificationLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  await User.sync({ alter: true });
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    await AuthVerifyToken.sync({ alter: true });
    await AuthVerifyToken.destroy({ where: { email: email } });

    const token = crypto.randomBytes(36).toString("hex");
    await AuthVerifyToken.create({ owner: user.id, token, email });
    //send Verification url with token to register email
    const link = `${VERIFICATION_LINK}?id=${user.id}&token=${token}`;

    await mail.sendVerification(user.email, link);

    return res.json({ message: "Please check your inbox" });
  }
};

export const createNewUser: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;

  await User.sync({ alter: true });
  const user = await User.findOne({ where: { email: email } });

  if (user)
    return sendErrorRes(
      res,
      "Unauthorized request, email already in use!",
      401
    );
  const users = await User.create(req.body);

  await AuthVerifyToken.sync({ alter: true });

  const token = crypto.randomBytes(36).toString("hex");
  await AuthVerifyToken.create({ owner: users.id, token, email });
  //send Verification url with token to register email
  const link = `${VERIFICATION_LINK}?id=${users.id}&token=${token}`;

  await mail.sendVerification(users.email, link);

  return res.json({ message: "Please check your inbox" });
};
////////////////////////////////////////////////////////////////////
export const verifyEmail: RequestHandler = async (req, res) => {
  const { id, token } = req.body;

  const authToken = await AuthVerifyToken.findOne({ where: { owner: id } });
  if (!authToken) return sendErrorRes(res, "Unauthorized Request!", 403);

  const isMatched = await authToken.compreToken(token);
  if (!isMatched)
    return sendErrorRes(res, "Unauthorized Request, invalid token!!", 403);

  await User.update({ isVerified: true }, { where: { id: id } });
  await AuthVerifyToken.destroy({ where: { owner: id } });
  res.json({ message: "Thanks for joining us, your email is verified!" });
};
////////////////////////////////////////////////////////////////////
export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user1 = await User.findOne({
    where: { email: email, isVerified: false },
  });
 // console.log("user1==>", user1);
  if (user1) {
    /* return sendErrorRes(
      res,
      "Please check inbox and verify your account!",
      403
    ); */

    res.json({
      profile: {
        id: user1.id,
        email: user1.email,
        name: user1.name,
        verified: user1.isVerified,
      },
    });
    return;
  }

  const user = await User.findOne({
    where: { email: email, isVerified: true },
  });

 // console.log("user==>", user);
  if (!user)
    return sendErrorRes(
      res,
      "Account not exist! click 'Sign Up' to register",
      403
    );

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendErrorRes(res, "Email/Password mismatch", 403);

  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_SECRET);

  const rToken = [];

  if (!user.tokens) user.tokens = refreshToken;
  else {
    rToken.push(user.tokens);
    rToken.push(refreshToken);
    user.tokens = refreshToken;
  }

  await User.update({ tokens: user.tokens }, { where: { id: user.id } });

  res.json({
    profile: {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: user.isVerified,
    },
    tokens: { refresh: refreshToken, access: accessToken },
    // message: "Success"
  });
};

////////////////////////////////////////////////////////////////////
export const sendProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: req.user,
  });
};

////////////////////////////////////////////////////////////////////
export const generateVerificationLink: RequestHandler = async (req, res) => {
  const { id } = req.user;
  const token = crypto.randomBytes(36).toString("hex");
  const link = `${VERIFICATION_LINK}?id=${id}&token=${token}`;

  await AuthVerifyToken.destroy({ where: { owner: id } });

  await AuthVerifyToken.create({ owner: id, token });

  await mail.sendVerification(req.user.email, link);

  res.json({ message: "Please check your inbox" });
};

////////////////////////////////////////////////////////////////////
export const grantAccessToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return sendErrorRes(res, "Unauthorized request!", 403);

  const payload = jwt.verify(refreshToken, JWT_SECRET) as { id: string };

  if (!payload.id) return sendErrorRes(res, "Unauthorized request!", 401);

  if (payload.id) {
    const user = await User.findOne({
      where: { id: payload.id, tokens: refreshToken },
    });

    if (!user) {
      //user is compromised
      await User.update({ tokens: "" }, { where: { id: payload.id } });
      return sendErrorRes(res, "Unauthorized request!", 401);
    }

    const newAccessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign({ id: user.id }, JWT_SECRET);

    await User.update(
      { tokens: newRefreshToken },
      { where: { id: payload.id } }
    );

    res.json({ tokens: { refresh: newRefreshToken, access: newAccessToken } });
  }
};
////////////////////////////////////////////////////////////////////
export const signOut: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({
    where: { id: req.user.id, tokens: refreshToken },
  });
  if (!user)
    return sendErrorRes(res, "Unauthorized access, user not found!", 403);

  await User.update({ tokens: "" }, { where: { id: user.id } });

  res.send();
};
////////////////////////////////////////////////////////////////////
export const generateForgetPassLink: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user) return sendErrorRes(res, "Account not found!", 404);

  await PassResetToken.sync({ alter: true });

  await PassResetToken.destroy({ where: { owner: user.id } });

  const token = crypto.randomBytes(36).toString("hex");
  await PassResetToken.create({ owner: user.id, token: token });

  //send the link
  const passResetLink = `${PASSWORD_RESET_LINK}?id=${user.id}&token=${token}`;

  await mail.sendPassResetLink(user.email, passResetLink);

  res.json({ message: "Please check your email" });
};
////////////////////////////////////////////////////////////////////
export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};
////////////////////////////////////////////////////////////////////
export const updatePassword: RequestHandler = async (req, res) => {
  const { id, password } = req.body;

  const user = await User.findOne({ where: { id: id } });
  if (!user) return sendErrorRes(res, "Unauthorized access!", 403);

  const matched = await user.comparePassword(password);
  if (matched)
    return sendErrorRes(res, "The new password must be different!", 422);

  //user.password = password;
  const salt = await genSalt(10);
  const newPassword = await hash(password, salt);

  await User.update({ password: newPassword }, { where: { id: id } });

  await PassResetToken.destroy({ where: { owner: id } });
  await mail.sendPasswordResetMessage(user.email!);
  res.json({ message: "Password reset successfully" });
};
////////////////////////////////////////////////////////////////////
export const updateProfile: RequestHandler = async (req, res) => {
  const { name } = req.body;

  if (typeof name !== "string" || name.trim().length < 3) {
    return sendErrorRes(res, "Invalid name!", 422);
  }
  await User.update({ name: name }, { where: { id: req.user.id } });
  res.json({ profile: { ...req.user, name } });
};

////////////////////////////////////////////////////////////////////
export const saveProfile: RequestHandler = async (req, res) => {
  const { name, email, address, phone, goal, dob } = req.body;

  if (typeof name !== "string" || name.trim().length < 3) {
    return sendErrorRes(res, "Invalid name!", 422);
  }

  await Profile.sync({ alter: true });
  await User.sync({ alter: true });

  const profileExist = await Profile.findOne({
    where: { email: email, profileName: name },
  });

  if (!profileExist) {
    await Profile.create({
      profileName: name,
      email: email,
      address: address,
      phone: phone,
      goal: goal,
      dob: dob,
    });
    res.json({ message: "Profile Saved!" });
  } else {
    return sendErrorRes(res, "Profile already exist with this Name!!", 403);
  }
};
