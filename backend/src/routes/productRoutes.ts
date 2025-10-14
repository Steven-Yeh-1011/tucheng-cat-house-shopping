import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { DatabaseService } from '../services/DatabaseService';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const databaseService = new DatabaseService();
const productService = new ProductService(databaseService);
const productController = new ProductController(productService);

// 公開路由
router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));

// 需要認證的路由
router.post('/', authenticateToken, requireAdmin, (req, res) => productController.createProduct(req, res));
router.put('/:id', authenticateToken, requireAdmin, (req, res) => productController.updateProduct(req, res));
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => productController.deleteProduct(req, res));

export default router;

