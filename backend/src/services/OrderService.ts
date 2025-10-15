import { DatabaseService } from './DatabaseService';
import { Order, OrderItem, CreateOrderRequest, OrderWithItems } from '../types/order.types';

export class OrderService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  // 創建訂單
  async createOrder(userId: number, orderData: CreateOrderRequest): Promise<Order> {
    const client = await this.db.getClient();
    
    try {
      await client.query('BEGIN');

      // 計算總金額
      const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // 插入訂單
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_amount, shipping_method, shipping_cost, shipping_address, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING *`,
        [userId, totalAmount, orderData.shipping_method, orderData.shipping_cost, orderData.shipping_address]
      );

      const order = orderResult.rows[0];

      // 插入訂單商品
      for (const item of orderData.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, item.price]
        );

        // 更新商品庫存
        await client.query(
          `UPDATE products SET stock = stock - $1 WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }

      // 清空購物車
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 獲取用戶訂單列表
  async getUserOrders(userId: number): Promise<OrderWithItems[]> {
    const result = await this.db.query(
      `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'product_name', p.name,
                  'product_image', p.image_url
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  // 獲取單一訂單詳情
  async getOrderById(orderId: number, userId: number): Promise<OrderWithItems | null> {
    const result = await this.db.query(
      `SELECT o.*,
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'product_name', p.name,
                  'product_image', p.image_url
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [orderId, userId]
    );

    return result.rows[0] || null;
  }

  // 更新訂單狀態
  async updateOrderStatus(orderId: number, status: Order['status']): Promise<Order> {
    const result = await this.db.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, orderId]
    );

    return result.rows[0];
  }

  // 獲取所有訂單（管理員）
  async getAllOrders(): Promise<OrderWithItems[]> {
    const result = await this.db.query(
      `SELECT o.*,
              u.email as user_email,
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'product_name', p.name,
                  'product_image', p.image_url
                )
              ) as items
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id, u.email
       ORDER BY o.created_at DESC`
    );

    return result.rows;
  }
}




