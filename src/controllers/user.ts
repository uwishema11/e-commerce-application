import { Request, Response } from "express";
import redis from "../config/redis";
import { sendEmail } from "../helpers/sendEmail";
import sendEmailOnRegistration from "../helpers/emailTemplate";
import {
  addUser,
  findUserByEmail,
  updatePasswordToken,
  updateVerifiedUser,
  resetPassword,
} from "../services/user";
import bcrypt from "bcrypt";
import { userType } from "../types/user";
import {
  generateAccessToken,
  verifyAccessToken,
} from "../helpers/generateToken";
import sendEmailOnResetPassword from "../helpers/resetPassword";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password, confirm_password, email } = req.body;

    const isUser = await findUserByEmail(email);
    if (isUser) {
      res.status(400).json({
        success: false,
        message:
          "User with the provided email already exists! Please try using different email",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConfirmPassword = await bcrypt.hash(confirm_password, salt);

    const body: userType = {
      ...req.body,
      password: hashedPassword,
      confirm_password: hashedConfirmPassword,
    };

    const token = await generateAccessToken(body);
    const verificationLink = `${process.env.BASE_URL}/auth/verify/${token}`;
    await sendEmail(
      body.email,
      sendEmailOnRegistration(req.body.firstName, verificationLink),
      "Account Verification"
    );

    const newUser = await addUser(body);

    newUser.password = "";
    newUser.confirm_password = "";
    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: newUser,
    });
    return;
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
    return;
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    if (!token) {
      res
        .status(400)
        .json({ success: false, message: "Invalid link! Please try again" });
      return;
    }
    const user = verifyAccessToken(token);

    const payload = user.data as userType;
    if (!payload) {
      res.status(400).json({
        success: false,
      });
    }

    if (!user.success) {
      res.status(400).json({ success: false, message: user.error });
      return;
    }

    const email = payload.email;

    const isUserVerified = await findUserByEmail(email);
    if (isUserVerified?.isVerified) {
      res.status(400).json({
        success: false,
        message: "User with the provided email is already verified!",
      });
      return;
    }
    await updateVerifiedUser(email);

    res.status(200).json({
      success: true,
      message: "Account is successfully verified",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
      return;
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      res.status(401).json({
        success: false,
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
      return;
    }
    const token = await generateAccessToken(user);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      error: (error as Error).message,
    });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "Loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "loggedout successfully",
    });
  } catch (error: unknown) {
    res.status(500).json({
      error: (error as Error).message,
    });
    return;
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User is not registered",
      });
      return;
    }
    const token = await generateAccessToken(user);
    await updatePasswordToken(token);

    const Link = `${process.env.BASE_URL}/reset-password/${token}`;
    await sendEmail(
      email,
      sendEmailOnResetPassword(user.firstName, Link),
      "Reset- Password"
    );

    res.status(200).json({
      success: true,
      message: "Link to reset your password have been sent to your email",
      token,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { password, confirm_password } = req.body;
    const { token } = req.params as { token: string };

    if (!token) {
      res.status(401).json({
        success: false,
        message: "The link is not valid or have expired",
      });
      return;
    }
    if (!password || !confirm_password) {
      res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
      return;
    }

    const user = verifyAccessToken(token);
    if (!user.success) {
      res.status(401).json({
        success: false,
        message:
          " your link to reset password has expired, Please try again with new linkS",
      });
      return;
    }

    const payload = user.data as { email: string };

    const isUserExist = await findUserByEmail(payload.email);
    if (!isUserExist) {
      res.status(401).json({
        success: false,
        message: "User not registered , Please provide the correct email",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConfirmPassword = await bcrypt.hash(confirm_password, salt);
    if (hashedConfirmPassword !== hashedPassword) {
      res.status(401).json({
        success: false,
        message: "Password and confirm_password must match",
      });
      return;
    }
    const reset_password_token = await redis.get(`reset_password_token`);
    if (!reset_password_token) {
      res.status(401).json({
        success: false,
        message:
          "Your link to reset password has expired, Please try again with new link",
      });
      return;
    }
    if (token !== reset_password_token) {
      res.status(401).json({
        success: false,
        message:
          "Your link to reset password has expired, Please try again with new link",
      });
      return;
    }

    await resetPassword(payload.email, hashedPassword);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};
