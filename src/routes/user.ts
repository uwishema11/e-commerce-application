import express from "express";
import { celebrate } from "celebrate";
import {
  registerUser,
  verifyUser,
  login,
  forgotPassword,
  resetUserPassword,
} from "../controllers/user";
import { userSchema } from "../validations/user";

const userRouter = express.Router();

userRouter.post(
  "/auth/register",
  celebrate({ body: userSchema }),
  registerUser
);
userRouter.post("/auth/login", login);
userRouter.post("/auth/verify/:token", verifyUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetUserPassword)

export default userRouter;
