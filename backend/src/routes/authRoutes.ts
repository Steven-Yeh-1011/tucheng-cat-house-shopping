import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { DatabaseService } from '../services/DatabaseService';

const router = Router();
const databaseService = new DatabaseService();
const authService = new AuthService(databaseService);
const authController = new AuthController(authService);

// 註冊
router.post('/register', (req, res) => authController.register(req, res));

// 登入
router.post('/login', (req, res) => authController.login(req, res));

export default router;

