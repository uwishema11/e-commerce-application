export interface cartType {
  name: string;
  productId: number;
  quantity: number;
  Total_price: number;
  status: string;
}

export interface orderType {
  orderId: number;
  name: string;
  userId: number;
  productId: number;
  quantity: number;
  price: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface updatecartType {
  name?: string;
  productId?: number;
  quantity?: number;
  Total_price?: number;
  status?: string;
}
