import express from "express";

import {
  updatePayements,
  createOrderAndMakePayment,
} from "../controllers/checkout";
import protectedRoute from "../middleware/verifyAuth";

const checkoutRouter = express.Router();

checkoutRouter.post(
  "/order-and-pay",
  protectedRoute,
  createOrderAndMakePayment
);

checkoutRouter.patch("/update:/id", updatePayements);

export default checkoutRouter;
