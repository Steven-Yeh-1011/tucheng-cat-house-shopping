import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const orderController = new OrderController();

// 所有訂單路由都需要認證
router.use(authenticateToken);

// 創建訂單
router.post('/', orderController.createOrder);

// 獲取用戶訂單列表
router.get('/my-orders', orderController.getUserOrders);

// 獲取單一訂單詳情
router.get('/:id', orderController.getOrderById);

// 更新訂單狀態（管理員）
router.patch('/:id/status', orderController.updateOrderStatus);

// 獲取所有訂單（管理員）
router.get('/admin/all', orderController.getAllOrders);

export default router;



