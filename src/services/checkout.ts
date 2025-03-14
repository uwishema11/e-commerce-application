import { prisma } from "../database/prismaClient";
import { checkoutType } from "../types/payment";

export const makePaymentService = async (data: checkoutType) => {
  return prisma.payment.upsert({
    where: { order_id: data.order_id },
    update: {
      payment_status: "completed",
      amount: data.amount,
      payment_method: data.payment_method,
    },
    create: data,
  });
};

export const getPaymentsService = async () => {
  return prisma.payment.findMany();
};

export const getPaymentByIdService = async (payment_id: string) => {
  return prisma.payment.findUnique({ where: { payment_id } });
};

export const updatePaymentService = async (
  payment_id: string,
  data: Partial<checkoutType>
) => {
  return prisma.payment.update({ where: { payment_id }, data });
};

export const deletePaymentService = async (payment_id: string) => {
  return prisma.payment.delete({ where: { payment_id } });
};

export const getPaymentByUserIdService = async (order_id: string) => {
  return prisma.payment.findMany({ where: { order_id } });
};

export const updatePaymentStatus = async (
  order_id: string,
  status: "completed" | "failed" | "pending"
) => {
  return await prisma.payment.update({
    where: { order_id },
    data: {
      payment_status: status,
    },
  });
};
