import express from "express";
import { errors } from "celebrate";
import morgan from "morgan";
const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(errors());

export default app;
