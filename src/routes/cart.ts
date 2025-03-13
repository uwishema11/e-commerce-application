import express from "express";
import {
  addProductToCart,
  viewCart,
  clearAllCartItems,
  removeProductsFromCart,
  updateCartItems,
} from "../controllers/cart";
import protectedRoute from "../middleware/verifyAuth";

const cartRouter = express.Router();

cartRouter.post("/addToCart/:productId", protectedRoute, addProductToCart);
cartRouter.post("/clear-cart", protectedRoute, clearAllCartItems);
cartRouter.post("/update-cart", protectedRoute, updateCartItems);
cartRouter.post("/removeFromCart", protectedRoute, removeProductsFromCart);
cartRouter.get("/", protectedRoute, viewCart);

export default cartRouter;
