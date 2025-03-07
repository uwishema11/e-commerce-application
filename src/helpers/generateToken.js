import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

const secret = process.env.JWT_SECRET;

export const generateAccessToken = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options = { expiresIn: "1d" };

  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// setting token in cookies

export const createSendToken = async (user, statusCode, message, res) => {
  const token = await generateAccessToken(user);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "PRODUCTION") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    success: true,
    message,
    accessToken: token,
  });
};
