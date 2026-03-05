export type ProductCategory = "set" | "addon" | "drink";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // field name is "image" to match backend
  pieceCount: string;
  peopleRecommended: string;
  category: ProductCategory;
  enabled: boolean;
  description?: string; // derived from peopleRecommended for display
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderNumber: number;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  phone: string;
  customerName: string;
  address: string;
  deliveryType: "delivery" | "pickup";
  deliveryTime: string;
  createdAt: number; // ms timestamp
}
