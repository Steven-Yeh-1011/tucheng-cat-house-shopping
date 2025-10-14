import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '註冊失敗'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || '登入失敗'
      });
    }
  }
}

