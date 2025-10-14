"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor(databaseService) {
        this.db = databaseService;
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    }
    async initializeAdmin() {
        try {
            const result = await this.db.query('SELECT id FROM users WHERE email = $1', ['cat750417@gmail.com']);
            if (result.rows.length === 0) {
                const hashedPassword = await bcryptjs_1.default.hash('Bowbow520', 10);
                await this.db.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', ['cat750417@gmail.com', hashedPassword, 'admin']);
                console.log('✅ 管理員帳號已創建: cat750417@gmail.com');
            }
            else {
                console.log('✅ 管理員帳號已存在');
            }
        }
        catch (error) {
            console.error('❌ 初始化管理員帳號失敗:', error);
            throw error;
        }
    }
    async register(email, password) {
        try {
            const existingUser = await this.db.query('SELECT id FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                throw new Error('用戶已存在');
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const result = await this.db.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at', [email, hashedPassword, 'user']);
            return result.rows[0];
        }
        catch (error) {
            console.error('註冊失敗:', error);
            throw error;
        }
    }
    async login(email, password) {
        try {
            const result = await this.db.query('SELECT id, email, password, role, created_at FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                throw new Error('用戶不存在');
            }
            const user = result.rows[0];
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('密碼錯誤');
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, this.jwtSecret, { expiresIn: '24h' });
            delete user.password;
            return { user, token };
        }
        catch (error) {
            console.error('登入失敗:', error);
            throw error;
        }
    }
    async verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.jwtSecret);
        }
        catch (error) {
            throw new Error('無效的 token');
        }
    }
}
exports.AuthService = AuthService;
