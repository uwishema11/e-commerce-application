import { Request, Response } from "express";
import { sendVerificationEmail } from "../helpers/sendEmail";
import sendEmailOnRegistration from "../helpers/emailTemplate";
import { addUser, findUserByEmail, updateVerifiedUser } from "../services/user";
import bcrypt from "bcrypt";
import { userType } from "../types/user";
import {
  generateAccessToken,
  verifyAccessToken,
} from "../helpers/generateToken";

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
    await sendVerificationEmail(
      body.email,
      sendEmailOnRegistration(req.body.firstName, verificationLink)
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
