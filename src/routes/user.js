import express from 'express'
import { celebrate } from "celebrate";
import { registerUser } from "../controllers/user.js";
import { userSchema } from '../validations/user.js';


const userRouter = express.Router();

userRouter.post("/auth/register", celebrate({ body: userSchema }), registerUser);

export default userRouter