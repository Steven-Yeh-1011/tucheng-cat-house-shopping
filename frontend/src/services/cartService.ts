import { apiClient as api } from './api';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    category_name?: string;
  };
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  itemId: number;
  quantity: number;
}

export const cartService = {
  // 取得購物車內容
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    return response.data.data || [];
  },

  // 加入商品到購物車
  addToCart: async ({ productId, quantity }: AddToCartRequest) => {
    const response = await api.post('/cart', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  // 更新商品數量
  updateQuantity: async ({ itemId, quantity }: UpdateQuantityRequest) => {
    const response = await api.put(`/cart/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // 移除商品
  removeItem: async (itemId: number) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // 清空購物車
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
