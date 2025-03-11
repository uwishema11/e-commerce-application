import express from "express";
import { celebrate } from "celebrate";
import {
  createOrderController,
  updateOrderController,
  deleteOrderController,
  getOrderByIdController,
  getOrdersController,
} from "../controllers/order";

import protectedRoute from "../middleware/verifyAuth";
import verifyAdmin from "../middleware/verifyAdmin";

const orderRouter = express.Router();

orderRouter.post("/create", protectedRoute, createOrderController);
orderRouter.patch("/edit/:id", protectedRoute, verifyAdmin, updateOrderController);
orderRouter.get("/", protectedRoute, verifyAdmin, getOrdersController);
orderRouter.get("/:id", protectedRoute, verifyAdmin,getOrderByIdController);
orderRouter.delete("/delete/:id", protectedRoute, verifyAdmin, deleteOrderController);

export default orderRouter;
