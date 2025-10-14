import { apiClient as api } from './api';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  shipping_method: string;
  shipping_cost: number;
  shipping_address?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_email?: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_method: string;
  shipping_cost: number;
  shipping_address?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  items?: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product_name?: string;
    product_image?: string;
  }>;
}

class OrderService {
  // 創建訂單
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  }

  // 獲取用戶訂單列表
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  }

  // 獲取單一訂單詳情
  async getOrderById(orderId: number): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  }

  // 更新訂單狀態（管理員）
  async updateOrderStatus(orderId: number, status: Order['status']): Promise<Order> {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data;
  }

  // 獲取所有訂單（管理員）
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/orders/admin/all');
    return response.data.data;
  }
}

export default new OrderService();


