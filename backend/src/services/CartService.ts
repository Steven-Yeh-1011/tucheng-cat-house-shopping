import { DatabaseService } from './DatabaseService';
import { CartItem, AddToCartRequest } from '../types';

/**
 * 購物車服務類別
 * 處理購物車的業務邏輯
 */
export class CartService {
  /**
   * 取得用戶的購物車內容
   */
  async getCart(userId: number): Promise<CartItem[]> {
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
      JOIN products p ON c.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await DatabaseService.query(sql, [userId]);
    return result.rows;
  }

  /**
   * 加入商品到購物車
   */
  async addToCart(userId: number, data: AddToCartRequest): Promise<CartItem> {
    // 檢查商品是否已在購物車中
    const checkSql = `
      SELECT * FROM cart_items
      WHERE user_id = $1 AND product_id = $2
    `;
    
    const existing = await DatabaseService.query(checkSql, [userId, data.product_id]);

    if (existing.rows.length > 0) {
      // 如果已存在，更新數量
      return this.updateCartItemQuantity(
        existing.rows[0].id,
        existing.rows[0].quantity + data.quantity
      );
    }

    // 新增到購物車
    const sql = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await DatabaseService.query(sql, [
      userId,
      data.product_id,
      data.quantity,
    ]);

    return result.rows[0];
  }

  /**
   * 更新購物車商品數量
   */
  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem> {
    if (quantity <= 0) {
      throw new Error('商品數量必須大於 0');
    }

    const sql = `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await DatabaseService.query(sql, [quantity, cartItemId]);
    
    if (result.rows.length === 0) {
      throw new Error('購物車項目不存在');
    }

    return result.rows[0];
  }

  /**
   * 移除購物車商品
   */
  async removeCartItem(cartItemId: number, userId: number): Promise<boolean> {
    const sql = `
      DELETE FROM cart_items
      WHERE id = $1 AND user_id = $2
    `;

    const result = await DatabaseService.query(sql, [cartItemId, userId]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * 清空購物車
   */
  async clearCart(userId: number): Promise<boolean> {
    const sql = `DELETE FROM cart_items WHERE user_id = $1`;
    await DatabaseService.query(sql, [userId]);
    return true;
  }

  /**
   * 取得購物車總金額
   */
  async getCartTotal(userId: number): Promise<number> {
    const sql = `
      SELECT SUM(p.price * c.quantity) as total
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `;

    const result = await DatabaseService.query(sql, [userId]);
    return parseFloat(result.rows[0].total || 0);
  }

  /**
   * 取得購物車商品數量
   */
  async getCartCount(userId: number): Promise<number> {
    const sql = `
      SELECT SUM(quantity) as count
      FROM cart_items
      WHERE user_id = $1
    `;

    const result = await DatabaseService.query(sql, [userId]);
    return parseInt(result.rows[0].count || 0);
  }
}

