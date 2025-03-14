import { paymentStatus } from "@prisma/client";

export interface checkoutType {
  user_id: string;
  payment_method: string;
  order_id: string;
  payment_status: paymentStatus;
  amount: number;
  status: string;
}
