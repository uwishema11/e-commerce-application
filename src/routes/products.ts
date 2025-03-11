import express from "express";
import * as productController from "../controllers/products";
import protectedRoute from "../middleware/verifyAuth";
import verifyAdmin from "../middleware/verifyAdmin";

const productRouter = express.Router();

productRouter.post(
  "/create",
  protectedRoute,
  verifyAdmin,
  productController.createProduct
);
productRouter.get("/", protectedRoute, productController.getProducts);
productRouter.get("/:id", protectedRoute, productController.getProductById);
productRouter.patch(
  "/:id",
  protectedRoute,
  verifyAdmin,
  productController.updateProductById
);
productRouter.delete(
  "/:id",
  protectedRoute,
  verifyAdmin,
  productController.deleteProductById
);

export default productRouter;
