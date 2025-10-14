"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../services/OrderService");
class OrderController {
    constructor() {
        this.createOrder = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: '未授權' });
                }
                const orderData = req.body;
                if (!orderData.items || orderData.items.length === 0) {
                    return res.status(400).json({ success: false, message: '訂單商品不能為空' });
                }
                const order = await this.orderService.createOrder(userId, orderData);
                res.status(201).json({
                    success: true,
                    message: '訂單創建成功',
                    data: order
                });
            }
            catch (error) {
                console.error('創建訂單錯誤:', error);
                res.status(500).json({
                    success: false,
                    message: '創建訂單失敗',
                    error: error instanceof Error ? error.message : '未知錯誤'
                });
            }
        };
        this.getUserOrders = async (req, res) => {
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
            }
            catch (error) {
                console.error('獲取訂單列表錯誤:', error);
                res.status(500).json({
                    success: false,
                    message: '獲取訂單列表失敗',
                    error: error instanceof Error ? error.message : '未知錯誤'
                });
            }
        };
        this.getOrderById = async (req, res) => {
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
            }
            catch (error) {
                console.error('獲取訂單詳情錯誤:', error);
                res.status(500).json({
                    success: false,
                    message: '獲取訂單詳情失敗',
                    error: error instanceof Error ? error.message : '未知錯誤'
                });
            }
        };
        this.updateOrderStatus = async (req, res) => {
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
            }
            catch (error) {
                console.error('更新訂單狀態錯誤:', error);
                res.status(500).json({
                    success: false,
                    message: '更新訂單狀態失敗',
                    error: error instanceof Error ? error.message : '未知錯誤'
                });
            }
        };
        this.getAllOrders = async (req, res) => {
            try {
                if (req.user?.role !== 'admin') {
                    return res.status(403).json({ success: false, message: '權限不足' });
                }
                const orders = await this.orderService.getAllOrders();
                res.json({
                    success: true,
                    data: orders
                });
            }
            catch (error) {
                console.error('獲取所有訂單錯誤:', error);
                res.status(500).json({
                    success: false,
                    message: '獲取訂單列表失敗',
                    error: error instanceof Error ? error.message : '未知錯誤'
                });
            }
        };
        this.orderService = new OrderService_1.OrderService();
    }
}
exports.OrderController = OrderController;
