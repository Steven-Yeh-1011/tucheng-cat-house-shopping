import { DatabaseService } from './DatabaseService';

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export class CategoryService {
  private db: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService;
  }

  async initializeCategories(): Promise<void> {
    try {
      // 檢查是否已有分類
      const result = await this.db.query('SELECT COUNT(*) FROM categories');
      const count = parseInt(result.rows[0].count);

      if (count === 0) {
        // 創建預設分類
        await this.db.query(`
          INSERT INTO categories (name, description) VALUES 
          ('貓糧', '各種貓咪飼料和乾糧'),
          ('玩具', '貓咪玩具和娛樂用品'),
          ('保健品', '貓咪營養補充品和保健品')
        `);
        console.log('✅ 商品分類已初始化');
      } else {
        console.log('✅ 商品分類已存在');
      }
    } catch (error) {
      console.error('❌ 初始化商品分類失敗:', error);
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    const result = await this.db.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  }

  async getCategoryById(id: number): Promise<Category | null> {
    const result = await this.db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const result = await this.db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [categoryData.name, categoryData.description]
    );
    return result.rows[0];
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(categoryData).forEach(([key, value]) => {
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
      UPDATE categories 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    return result.rows[0] || null;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM categories WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}
