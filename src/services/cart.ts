import redis from "../config/redis";
import { cartType } from "../types/order";

const testRedisConnection = async () => {
  try {
    await redis.ping();
    console.log("Redis is connected and responding.");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
};

testRedisConnection();

const createCart = async (userId: number) => {
  await redis.set(`client:${userId}`, JSON.stringify([]));
  return [];
};

export const getCart = async (userId: number) => {
  let cart = await redis.get(`client:${userId}`);
  if (!cart) {
    await createCart(userId);
    cart = JSON.stringify([]);
  } 
  return JSON.parse(cart);
};

export const addToCart = async (userId: number, items: cartType) => {
  const productList = await getCart(userId);

  let isInCart = false;
  productList.forEach((product: cartType) => {
    if (product.product_id === items.product_id) {
      isInCart = true;
      product.quantity += items.quantity;
      product.Total_price += items.Total_price;
    }
  });

  if (!isInCart) {
    productList.push(items);
  }
  await redis.set(`client:${userId}`, JSON.stringify(productList));
  return productList;
};

export const removeFromCart = async (userId: number, productId: number) => {
  const productList = await getCart(userId);
  const newCart = productList.filter(
    (item: cartType) => item.product_id !== productId
  );

  await redis.set(`client:${userId}`, JSON.stringify(newCart));
};

export const updateCartItem = async (
  userId: number,
  productId: number,
  quantityToUpdate: number
) => {
  const productList = await getCart(userId);

  if (!productList || productList.length === 0) {
    throw new Error("Cart is empty.");
  }

  let updatedProductList = productList
    .map((product: cartType) => {
      if (product.product_id === productId) {
        const pricePerUnit = product.Total_price / product.quantity;
        if (quantityToUpdate > 0) {
          product.quantity += quantityToUpdate;
          product.Total_price += pricePerUnit * quantityToUpdate;
        } else if (quantityToUpdate < 0) {
          const quantityToRemove = Math.abs(quantityToUpdate);
          product.quantity -= quantityToRemove;
          product.Total_price -= pricePerUnit * quantityToRemove;

          if (product.quantity <= 0) {
            return null;
          }
        }
      }
      return product;
    })
    .filter((product: cartType | null) => product !== null);
  await redis.set(`client:${userId}`, JSON.stringify(updatedProductList));
  return updatedProductList;
};

export const clearCart = async (userId: number) => {
  await redis.set(`client:${userId}`, JSON.stringify([]));
};

export const checkout = async (userId: number) => {
  const cart = await getCart(userId);
  await clearCart(userId);
  return cart;
};

export const getTotalCartPrice = async (userId: number) => {
  const productList = await getCart(userId);
  const totalPrice = productList.reduce(
    (total: number, product: cartType) => total + product.Total_price,
    0
  );
  return totalPrice;
};
