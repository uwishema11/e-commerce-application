import express from "express";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import morgan from "morgan";

import userRouter from "./routes/user";
import productRouter from "./routes/products";
import cartRouter from "./routes/cart";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

app.use(errors());

export default app;
