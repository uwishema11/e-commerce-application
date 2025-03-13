import { orderStatus } from "@prisma/client";

export interface cartType {
  name: string;
  product_id: number;
  quantity: number;
  Total_price: number;
  status: string;
}

export interface orderType {
  order_id: number;
  user_id: number;
  status: orderStatus;
}

export interface updatecartType {
  name?: string;
  productId?: number;
  quantity?: number;
  Total_price?: number;
  status?: string;
}
