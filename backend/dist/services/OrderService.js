"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const DatabaseService_1 = require("./DatabaseService");
class OrderService {
    constructor() {
        this.db = new DatabaseService_1.DatabaseService();
    }
    async createOrder(userId, orderData) {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');
            const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const orderResult = await client.query(`INSERT INTO orders (user_id, total_amount, shipping_method, shipping_cost, shipping_address, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING *`, [userId, totalAmount, orderData.shipping_method, orderData.shipping_cost, orderData.shipping_address]);
            const order = orderResult.rows[0];
            for (const item of orderData.items) {
                await client.query(`INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`, [order.id, item.product_id, item.quantity, item.price]);
                await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [item.quantity, item.product_id]);
            }
            await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
            await client.query('COMMIT');
            return order;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getUserOrders(userId) {
        const result = await this.db.query(`SELECT o.*, 
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
       ORDER BY o.created_at DESC`, [userId]);
        return result.rows;
    }
    async getOrderById(orderId, userId) {
        const result = await this.db.query(`SELECT o.*,
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
       GROUP BY o.id`, [orderId, userId]);
        return result.rows[0] || null;
    }
    async updateOrderStatus(orderId, status) {
        const result = await this.db.query(`UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`, [status, orderId]);
        return result.rows[0];
    }
    async getAllOrders() {
        const result = await this.db.query(`SELECT o.*,
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
       ORDER BY o.created_at DESC`);
        return result.rows;
    }
}
exports.OrderService = OrderService;
