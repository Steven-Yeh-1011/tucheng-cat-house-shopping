import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './DatabaseService';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
}

export class AuthService {
  private db: DatabaseService;
  private jwtSecret: string;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async initializeAdmin(): Promise<void> {
    try {
      // 檢查是否已有管理員
      const result = await this.db.query(
        'SELECT id FROM users WHERE email = $1',
        ['cat750417@gmail.com']
      );

      if (result.rows.length === 0) {
        // 創建管理員帳號
        const hashedPassword = await bcrypt.hash('Bowbow520', 10);
        await this.db.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
          ['cat750417@gmail.com', hashedPassword, 'admin']
        );
        console.log('✅ 管理員帳號已創建: cat750417@gmail.com');
      } else {
        console.log('✅ 管理員帳號已存在');
      }
    } catch (error) {
      console.error('❌ 初始化管理員帳號失敗:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      // 檢查用戶是否已存在
      const existingUser = await this.db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('用戶已存在');
      }

      // 加密密碼
      const hashedPassword = await bcrypt.hash(password, 10);

      // 創建用戶
      const result = await this.db.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
        [email, hashedPassword, 'user']
      );

      return result.rows[0];
    } catch (error) {
      console.error('註冊失敗:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // 查找用戶
      const result = await this.db.query(
        'SELECT id, email, password, role, created_at FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('用戶不存在');
      }

      const user = result.rows[0];

      // 驗證密碼
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('密碼錯誤');
      }

      // 生成 JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        this.jwtSecret,
        { expiresIn: '24h' }
      );

      // 移除密碼字段
      delete user.password;

      return { user, token };
    } catch (error) {
      console.error('登入失敗:', error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('無效的 token');
    }
  }
}

