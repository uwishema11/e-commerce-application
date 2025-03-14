import { Request, Response } from "express";

import {
  addProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  updateProduct,
} from "../services/products";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { total_quantity } = req.body;
    if (total_quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Total quantity must be greater than 0",
      });
      return;
    }
    const result = {
      ...req.body,
      userId: req.user?.id,
    };
    const response = await addProduct(result);
    res.status(200).json({ success: true, data: response });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await findAllProducts();
    res.status(200).json({ success: true, data: products });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  return;
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const isProductExist = await findProductById(id);
    if (!isProductExist) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    const product = await findProductById(id);
    res.status(200).json({ success: true, data: product });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};

export const updateProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const result = {
      ...req.body,
      user_id: req.user?.id,
    };
    const isProductExist = await findProductById(id);
    if (!isProductExist) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    const response = await updateProduct(id, result);
    res.status(200).json({ success: true, data: response });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const deleteProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const isProductExist = await findProductById(id);
    if (!isProductExist) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    const response = await deleteProduct(id);
    res.status(200).json({ success: true, data: response });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};
