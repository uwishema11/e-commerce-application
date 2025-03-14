import { prisma } from "../database/prismaClient";
import { productType } from "../types/products";

export const addProduct = async (newProduct: productType) => {
  const registeredProduct = await prisma.product.create({
    data: {
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      stock_quantity: newProduct.stock_quantity,
      user: {
        connect: { id: newProduct.userId },
      },
    },
  });
  return registeredProduct;
};

export const findAllProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      status: "available",
    },
  });
  return products;
};

export const findProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      product_id: id,
    },
  });
  return product;
};

export const updateProduct = async (
  id: string,
  updatedProduct: Partial<productType>
) => {
  return await prisma.product.update({
    data: {
      ...updatedProduct,
      updated_at: new Date(),
      user: updatedProduct.userId
        ? { connect: { id: updatedProduct.userId } }
        : undefined,
    },
    where: { product_id: id },
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { product_id: id },
  });
};
