import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User from "src/config/models/User";
import PassResetToken from "src/config/models/PassResetToken";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfile;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) return sendErrorRes(res, "unauthorized request!", 403);

    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findOne({ where: { id: payload.id } });

    if (!user) return sendErrorRes(res, "Unauthorized request!", 403);

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      verified: user.isVerified,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return sendErrorRes(res, "Session expired!", 401);
    if (error instanceof JsonWebTokenError)
      return sendErrorRes(res, "Unauthorized access!", 401);
    next(error);
  }
};
/////////////////////////////////////////////////////////////////
export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { id, token } = req.body;
  //PassResetToken.sync();
  const passResetToken = await PassResetToken.findOne({ where: { owner: id } });
  if (!passResetToken)
    return sendErrorRes(res, "Unauthorized request, invalid Token!", 403);
  const matched = await passResetToken.compareToken(token);
  if (!matched)
    return sendErrorRes(res, "Unauthorized request, invalid Token!", 403);
  next();
};
