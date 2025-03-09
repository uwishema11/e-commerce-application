import express from "express";
import { celebrate } from "celebrate";
import { registerUser, verifyUser } from "../controllers/user";
import { userSchema } from "../validations/user";

const userRouter = express.Router();

userRouter.post(
  "/auth/register",
  celebrate({ body: userSchema }),
  registerUser
);
userRouter.post("/auth/verify/:token", verifyUser);

export default userRouter;
