import { Request, Response } from "express";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getOrders,
} from "../services/order";


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const updateOrderController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const isOrderExist = await getOrderById(id);
    if (!isOrderExist) {
      res.status(404).json({
        success: false,
        message: "Order not found! Please check if it was not removed",
      });
      return;
    }

    const result = {
      ...req.body,
      user_id: req.user?.id,
    };
    const response = await updateOrder(id, result);
    res.status(200).json({ success: true, data: response });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};

export const deleteOrderController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const isOrderExist = await getOrderById(id);
    if (!isOrderExist) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    const response = await deleteOrder(id);
    res.status(200).json({
      success: true,
      message: "order deleted successfully",
    });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};

export const getOrdersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await getOrders();
    res.status(200).json({ success: true, data: orders });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  return;
};

export const getOrderByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const isOrderExist = await getOrderById(id);
    if (!isOrderExist) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    const order = await getOrderById(id);
    res.status(200).json({ success: true, data: order });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  return;
};
