import express from "express";
import { celebrate } from "celebrate";

import * as productController from "../controllers/products";
import protectedRoute from "../middleware/verifyAuth";
import verifyAdmin from "../middleware/verifyAdmin";
import { productSchema } from "../validations/product";

const productRouter = express.Router();

productRouter.post(
  "/create",
  celebrate({ body: productSchema }),
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
