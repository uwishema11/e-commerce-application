import jwt from "jsonwebtoken";
import { tokenData } from "../types/user";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const expires = Number(process.env.JWT_COOKIE_EXPIRES_IN);

export const generateAccessToken = async (user: tokenData) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options = { expiresIn: "1d" as jwt.SignOptions["expiresIn"] };

  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
