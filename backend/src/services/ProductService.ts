import { DatabaseService } from './DatabaseService';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  stock: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export class ProductService {
  private db: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService;
  }

  async getAllProducts(): Promise<Product[]> {
    const result = await this.db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  }

  async getProductById(id: number): Promise<Product | null> {
    const result = await this.db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const result = await this.db.query(`
      INSERT INTO products (name, description, price, category_id, stock, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [productData.name, productData.description, productData.price, productData.category_id, productData.stock, productData.image_url]);
    return result.rows[0];
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
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

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async updateStock(id: number, quantity: number): Promise<boolean> {
    const result = await this.db.query(
      'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2 AND stock >= $1',
      [quantity, id]
    );
    return result.rowCount > 0;
  }
}
