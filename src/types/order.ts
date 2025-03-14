import { orderStatus } from "@prisma/client";

export interface cartType {
  name: string;
  product_id: string;
  quantity: number;
  Total_price: number;
  status: string;
}

export interface orderType {
  order_id: string;
  user_id: string;
  status: orderStatus;
}

export interface updatecartType {
  name?: string;
  productId?: string;
  quantity?: string;
  Total_price?: number;
  status?: string;
}
