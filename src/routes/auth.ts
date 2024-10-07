import { Router } from "express";
import User from "src/config/models/User";
import {
  createNewUser,
  generateForgetPassLink,
  generateVerificationLink,
  getBaseProfile,
  grantAccessToken,
  grantValid,
  resendVerificationLink,
  saveProfile,
  sendProfile,
  signIn,
  signOut,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "src/controllers/auth";
import { isAuth, isValidPassResetToken } from "src/middleware/auth";
import validate from "src/middleware/validator";
import {
  newUserSchema,
  resetPassSchema,
  verifyTokenSchema,
} from "src/utils/validationSchema";

const authRouter = Router();

authRouter.post("/sign-up", validate(newUserSchema), createNewUser);
authRouter.post("/verify", validate(verifyTokenSchema), verifyEmail);
authRouter.post(
  "/re-verify",
  // validate(verifyTokenSchema),
  resendVerificationLink
);
authRouter.get("/verify-token", isAuth, generateVerificationLink);
authRouter.post("/sign-in", signIn);
authRouter.get("/profile", isAuth, sendProfile);
authRouter.post("/saveBaseProfile", saveProfile);
authRouter.get("/baseProfile/:email", getBaseProfile);
authRouter.post("/refresh-token", grantAccessToken);
authRouter.post("/sign-out", isAuth, signOut);
authRouter.post("/forget-pass", generateForgetPassLink);
authRouter.post("/saveBaseProfile", isAuth, saveProfile);
authRouter.post(
  "/verify-pass-reset-token",
  validate(verifyTokenSchema),
  isValidPassResetToken,
  grantValid
);
authRouter.post(
  "/reset-pass",
  validate(resetPassSchema),
  isValidPassResetToken,
  updatePassword
);
authRouter.patch("/update-profile", isAuth, updateProfile);

export default authRouter;
