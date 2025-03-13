import { Request, Response } from "express";

import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getTotalCartPrice,
} from "../services/cart";
import { findProductById } from "../services/products";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
  params: {
    [key: string]: string;
  };
}

export const addProductToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId;
    if (!productId) {
      res.status(400).json({
        message: "No product selected to add to cart! Please select one",
      });
      return;
    }
    const product = await findProductById(Number(productId));
    if (product?.status === "out-of-stock") {
      res.status(400).json({ message: "This product is out of stock" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "Invalid user" });
      return;
    }

    const order_item = {
      product_id: Number(productId),
      name: product?.name ?? "",
      quantity: req.body.quantity,
      Total_price: (product?.price ?? 0) * req.body.quantity,
      status: product?.status ?? "",
    };
    const cart = await addToCart(userId, order_item);
    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
    return;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
  return;
};

export const viewCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id?.toString();
    if (!userId) {
      res
        .status(400)
        .json({ message: "Your session have expired please login again" });
      return;
    }
    const allProducts = await getCart(Number(userId));
    res.status(200).json({
      success: true,
      data: allProducts,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "An unknown error occurred" });
  }
  return;
};

export const removeProductsFromCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const product_id = req.body.productId;
    if (!userId || !product_id) {
      res.status(400).json({ message: "Invalid user or product ID" });
      return;
    }
    await removeFromCart(userId, Number(product_id));
    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {}
};

export const updateCartItems = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const quantity = req.body.quantity;
    const product_id = req.body.productId;
    const cart = await updateCartItem(
      Number(userId),
      Number(product_id),
      quantity
    );
    const totalPrice = await getTotalCartPrice(Number(userId));

    res.status(200).json({
      success: true,
      message: "cart_item is succfully updated",
      data: cart,
      totalPrice,
    });
    return;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred! Please try again";
    res.status(500).json({ message: errorMessage });
  }
  return;
};

export const clearAllCartItems = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    await clearCart(Number(userId));
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
