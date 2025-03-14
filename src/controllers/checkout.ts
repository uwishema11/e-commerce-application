import { Request, Response } from "express";

import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
} from "../services/order";
import { clearCart, getCart, getTotalCartPrice } from "../services/cart";

import {
  makePaymentService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
  updatePaymentStatus,
} from "../services/checkout";
import { AuthenticatedRequest } from "../types/authentication";

export const createOrderAndMakePayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const cart = await getCart(userId);

    if (!cart || cart.length === 0) {
      res
        .status(400)
        .json({ message: "Cart is empty! Add something in cart to proceed" });
      return;
    }

    const total_amount = await getTotalCartPrice(userId);
    const formattedOrderItems = cart.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      total_price: item.Total_price,
    }));

    const orderData = {
      user_id: userId,
      order_items: formattedOrderItems,
      total_amount: total_amount,
    };
    const orderResponse = await createOrder(orderData);

    const paymentData = {
      ...req.body,
      user_id: userId,
      order_id: orderResponse.order_id,
    };

    if (req.body.amount < total_amount) {
      res.status(400).json({
        message: "Insufficient amount! Please add money to your card",
      });
      return;
    }

    await makePaymentService(paymentData);

    const updatedOrderData = await updateOrder(orderResponse.order_id, {
      status: "delivered",
    });
    const updatedPaymentData = await updatePaymentStatus(
      orderResponse.order_id,
      "completed"
    );
    await clearCart(userId);

    res.status(201).json({
      success: true,
      message: "Order created and payment processed successfully",
      order: updatedOrderData,
      payment: updatedPaymentData,
    });
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const updatePayements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payment_id = req.params.payment_id;
    const payment = await getPaymentByIdService(payment_id);
    if (!payment) {
      res.status(404).json({
        message: "Payment not found! make sure it is still available",
      });
      return;
    }
    await updatePaymentService(payment_id, req.body);
    res.status(200).json({
      success: true,
      message: "Payment has been successfully updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deletePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payment_id = req.params.id;
    if (!payment_id) {
      res.status(400).json({
        success: false,
        message: "payment not found. Please try again!",
      });
      return;
    }
    await deletePaymentService(payment_id);
    res.status(200).json({
      success: true,
      message: "Payment has been successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
