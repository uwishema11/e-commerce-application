import express from "express";
import { errors } from "celebrate";
import morgan from "morgan";

import userRouter from "./routes/user.js";



const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(errors());



app.use('/api/users', userRouter);

export default app;
