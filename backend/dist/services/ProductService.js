"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    constructor(databaseService) {
        this.db = databaseService;
    }
    async getAllProducts() {
        const result = await this.db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);
        return result.rows;
    }
    async getProductById(id) {
        const result = await this.db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
        return result.rows[0] || null;
    }
    async createProduct(productData) {
        const result = await this.db.query(`
      INSERT INTO products (name, description, price, category_id, stock, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [productData.name, productData.description, productData.price, productData.category_id, productData.stock, productData.image_url]);
        return result.rows[0];
    }
    async updateProduct(id, productData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        Object.entries(productData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'created_at') {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });
        if (fields.length === 0) {
            throw new Error('沒有要更新的欄位');
        }
        values.push(id);
        const result = await this.db.query(`
      UPDATE products 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
        return result.rows[0] || null;
    }
    async deleteProduct(id) {
        const result = await this.db.query('DELETE FROM products WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
    async updateStock(id, quantity) {
        const result = await this.db.query('UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2 AND stock >= $1', [quantity, id]);
        return result.rowCount > 0;
    }
}
exports.ProductService = ProductService;
