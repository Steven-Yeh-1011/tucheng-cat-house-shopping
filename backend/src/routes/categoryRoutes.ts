import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '../services/CategoryService';
import { DatabaseService } from '../services/DatabaseService';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const databaseService = new DatabaseService();
const categoryService = new CategoryService(databaseService);
const categoryController = new CategoryController(categoryService);

// 公開路由
router.get('/', (req, res) => categoryController.getAllCategories(req, res));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));

// 需要認證的路由
router.post('/', authenticateToken, requireAdmin, (req, res) => categoryController.createCategory(req, res));
router.put('/:id', authenticateToken, requireAdmin, (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => categoryController.deleteCategory(req, res));

export default router;

