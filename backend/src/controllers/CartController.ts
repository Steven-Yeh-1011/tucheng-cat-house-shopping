import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/CartService';
import { AddToCartRequest } from '../types';
import Joi from 'joi';

/**
 * 購物車控制器
 * 處理購物車相關的 HTTP 請求
 */
export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  /**
   * 取得購物車內容
   */
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '請先登入',
          },
        });
      }

      const items = await this.cartService.getCart(req.user.id);
      const total = await this.cartService.getCartTotal(req.user.id);
      const count = await this.cartService.getCartCount(req.user.id);

      res.json({
        success: true,
        data: {
          items,
          total,
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 加入商品到購物車
   */
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '請先登入',
          },
        });
      }

      const data: AddToCartRequest = req.body;

      // 驗證輸入
      const schema = Joi.object({
        product_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
      });

      const { error, value } = schema.validate(data);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.details[0].message,
          },
        });
      }

      const cartItem = await this.cartService.addToCart(req.user.id, value);

      res.status(201).json({
        success: true,
        data: cartItem,
        message: '商品已加入購物車',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新購物車商品數量
   */
  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = parseInt(req.params.id);
      const { quantity } = req.body;

      const schema = Joi.object({
        quantity: Joi.number().integer().positive().required(),
      });

      const { error } = schema.validate({ quantity });
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.details[0].message,
          },
        });
      }

      const cartItem = await this.cartService.updateCartItemQuantity(cartItemId, quantity);

      res.json({
        success: true,
        data: cartItem,
        message: '數量已更新',
      });
    } catch (error: any) {
      if (error.message.includes('不存在')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * 移除購物車商品
   */
  async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '請先登入',
          },
        });
      }

      const cartItemId = parseInt(req.params.id);
      const success = await this.cartService.removeCartItem(cartItemId, req.user.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '找不到此購物車項目',
          },
        });
      }

      res.json({
        success: true,
        message: '商品已移除',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 清空購物車
   */
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '請先登入',
          },
        });
      }

      await this.cartService.clearCart(req.user.id);

      res.json({
        success: true,
        message: '購物車已清空',
      });
    } catch (error) {
      next(error);
    }
  }
}

