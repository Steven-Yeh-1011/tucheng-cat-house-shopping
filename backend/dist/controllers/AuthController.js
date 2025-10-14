"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: '請提供 email 和密碼'
                });
                return;
            }
            const user = await this.authService.register(email, password);
            res.status(201).json({
                success: true,
                message: '註冊成功',
                data: { user }
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || '註冊失敗'
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: '請提供 email 和密碼'
                });
                return;
            }
            const { user, token } = await this.authService.login(email, password);
            res.json({
                success: true,
                message: '登入成功',
                data: { user, token }
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message || '登入失敗'
            });
        }
    }
}
exports.AuthController = AuthController;
