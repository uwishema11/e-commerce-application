import { prisma } from "../database/prismaClient";
import { orderType } from "../types/order";

export async function createOrder(data: any) {
  return prisma.order.create({
    data: {
      user_id: data.user_id,
      total_amount: data.total_amount,
      order_items: {
        create: data.order_items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          total_price: item.total_price,

        })),
      },
    },
    include: {
      order_items: true,
    },
  });
}

export async function getOrders() {
  return prisma.order.findMany();
}

export async function getOrderById(order_id: string) {
  return prisma.order.findUnique({ where: { order_id } });
}

export async function updateOrder(order_id: string, data: any) {
  return prisma.order.update({ where: { order_id }, data });
}

export async function deleteOrder(order_id: string) {
  return prisma.order.delete({ where: { order_id } });
}
