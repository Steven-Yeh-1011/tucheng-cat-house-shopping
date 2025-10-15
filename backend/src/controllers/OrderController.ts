import { Response } from 'express';
import { OrderService } from '../services/OrderService';
import { AuthenticatedRequest } from '../types';
import { CreateOrderRequest } from '../types/order.types';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // 創建訂單
  createOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: '未授權' });
      }

      const orderData: CreateOrderRequest = req.body;

      if (!orderData.items || orderData.items.length === 0) {
        return res.status(400).json({ success: false, message: '訂單商品不能為空' });
      }

      const order = await this.orderService.createOrder(userId, orderData);

      res.status(201).json({
        success: true,
        message: '訂單創建成功',
        data: order
      });
    } catch (error) {
      console.error('創建訂單錯誤:', error);
      res.status(500).json({
        success: false,
        message: '創建訂單失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  };

  // 獲取用戶訂單列表
  getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: '未授權' });
      }

      const orders = await this.orderService.getUserOrders(userId);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('獲取訂單列表錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取訂單列表失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  };

  // 獲取單一訂單詳情
  getOrderById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: '未授權' });
      }

      const orderId = parseInt(req.params.id);
      const order = await this.orderService.getOrderById(orderId, userId);

      if (!order) {
        return res.status(404).json({ success: false, message: '訂單不存在' });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('獲取訂單詳情錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取訂單詳情失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  };

  // 更新訂單狀態（管理員）
  updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: '權限不足' });
      }

      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      const order = await this.orderService.updateOrderStatus(orderId, status);

      res.json({
        success: true,
        message: '訂單狀態更新成功',
        data: order
      });
    } catch (error) {
      console.error('更新訂單狀態錯誤:', error);
      res.status(500).json({
        success: false,
        message: '更新訂單狀態失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  };

  // 獲取所有訂單（管理員）
  getAllOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: '權限不足' });
      }

      const orders = await this.orderService.getAllOrders();

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('獲取所有訂單錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取訂單列表失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  };
}




