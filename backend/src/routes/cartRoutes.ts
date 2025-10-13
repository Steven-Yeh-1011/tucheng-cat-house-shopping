import express from 'express';
import { CartController } from '../controllers/CartController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const cartController = new CartController();

/**
 * 購物車相關路由
 * 所有路由都需要認證
 */

// 取得購物車內容
router.get('/', authenticateToken, (req, res, next) => 
  cartController.getCart(req, res, next)
);

// 加入商品到購物車
router.post('/', authenticateToken, (req, res, next) => 
  cartController.addToCart(req, res, next)
);

// 更新購物車商品數量
router.put('/:id', authenticateToken, (req, res, next) => 
  cartController.updateCartItem(req, res, next)
);

// 移除購物車商品
router.delete('/:id', authenticateToken, (req, res, next) => 
  cartController.removeCartItem(req, res, next)
);

// 清空購物車
router.delete('/', authenticateToken, (req, res, next) => 
  cartController.clearCart(req, res, next)
);

export default router;

