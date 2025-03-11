import express from "express";
import { celebrate } from "celebrate";
import { registerUser, verifyUser, login } from "../controllers/user";
import { userSchema } from "../validations/user";
import { protect } from "../middleware/verifyAuth";

const userRouter = express.Router();

userRouter.post(
  "/auth/register",
  celebrate({ body: userSchema }),
  registerUser
);
userRouter.post("/auth/login", login);
userRouter.post("/auth/verify/:token", verifyUser);

export default userRouter;
