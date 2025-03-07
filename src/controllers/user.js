import { addUser, findUserByEmail } from "../services/user.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  createSendToken,
} from "../helpers/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    const isUser = await findUserByEmail(email);
    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const hashedConfirmPassword = await bcrypt.hash(confirm_password, salt);

    const body = {
      ...req.body,
      password: hashedPassword,
    };
    const newUser = await addUser(body);

    newUser.password = undefined;
    newUser.confirm_password = undefined;

    await createSendToken(newUser, 201, " Successfully registered", res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
