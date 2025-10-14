"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const DatabaseService_1 = require("./DatabaseService");
class CartService {
    constructor() {
        this.databaseService = new DatabaseService_1.DatabaseService();
    }
    async getCart(userId) {
        const sql = `
      SELECT 
        c.*,
        p.name as product_name,
        p.price as product_price,
        p.image_urls as product_image_urls,
        p.stock_quantity as product_stock,
        p.is_active as product_is_active,
        cat.name as category_name
      FROM cart_items c
      JOIN products p ON c.productId = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
        const result = await this.databaseService.query(sql, [userId]);
        return result.rows;
    }
    async addToCart(userId, data) {
        const checkSql = `
      SELECT * FROM cart_items
      WHERE user_id = $1 AND productId = $2
    `;
        const existing = await this.databaseService.query(checkSql, [userId, data.productId]);
        if (existing.rows.length > 0) {
            return this.updateCartItemQuantity(existing.rows[0].id, existing.rows[0].quantity + data.quantity);
        }
        const sql = `
      INSERT INTO cart_items (user_id, productId, quantity)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const result = await this.databaseService.query(sql, [
            userId,
            data.productId,
            data.quantity,
        ]);
        return result.rows[0];
    }
    async updateCartItemQuantity(cartItemId, quantity) {
        if (quantity <= 0) {
            throw new Error('商品數量必須大於 0');
        }
        const sql = `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await this.databaseService.query(sql, [quantity, cartItemId]);
        if (result.rows.length === 0) {
            throw new Error('購物車項目不存在');
        }
        return result.rows[0];
    }
    async removeCartItem(cartItemId, userId) {
        const sql = `
      DELETE FROM cart_items
      WHERE id = $1 AND user_id = $2
    `;
        const result = await this.databaseService.query(sql, [cartItemId, userId]);
        return (result.rowCount || 0) > 0;
    }
    async clearCart(userId) {
        const sql = `DELETE FROM cart_items WHERE user_id = $1`;
        await this.databaseService.query(sql, [userId]);
        return true;
    }
    async getCartTotal(userId) {
        const sql = `
      SELECT SUM(p.price * c.quantity) as total
      FROM cart_items c
      JOIN products p ON c.productId = p.id
      WHERE c.user_id = $1
    `;
        const result = await this.databaseService.query(sql, [userId]);
        return parseFloat(result.rows[0].total || 0);
    }
    async getCartCount(userId) {
        const sql = `
      SELECT SUM(quantity) as count
      FROM cart_items
      WHERE user_id = $1
    `;
        const result = await this.databaseService.query(sql, [userId]);
        return parseInt(result.rows[0].count || 0);
    }
}
exports.CartService = CartService;
