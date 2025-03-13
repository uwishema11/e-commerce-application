import { Request, Response } from "express";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getOrders,
} from "../services/order";
import { getCart } from "../services/cart";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
export const createOrderController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const cart = await getCart(Number(userId));

    if (!cart || cart.length === 0) {
      res
        .status(400)
        .json({ message: "Cart is empty! Add something in cart to proceed" });
      return;
    }

    const formattedOrderItems = cart.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    const orderData = {
      user_id: userId,
      order_items: formattedOrderItems,
    };

    const response = await createOrder(orderData);

    res.status(201).json({ success: true, data: response });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const updateOrderController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const isOrderExist = await getOrderById(Number(id));
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
    const response = await updateOrder(Number(id), result);
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
    const isOrderExist = await getOrderById(Number(id));
    if (!isOrderExist) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    const response = await deleteOrder(Number(id));
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
    const isOrderExist = await getOrderById(Number(id));
    if (!isOrderExist) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    const order = await getOrderById(Number(id));
    res.status(200).json({ success: true, data: order });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  return;
};
