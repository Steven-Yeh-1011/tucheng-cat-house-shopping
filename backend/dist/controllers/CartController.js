"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const CartService_1 = require("../services/CartService");
const joi_1 = __importDefault(require("joi"));
class CartController {
    constructor() {
        this.cartService = new CartService_1.CartService();
    }
    async getCart(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async addToCart(req, res, next) {
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
            const data = req.body;
            const schema = joi_1.default.object({
                product_id: joi_1.default.number().integer().positive().required(),
                quantity: joi_1.default.number().integer().positive().required(),
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
        }
        catch (error) {
            next(error);
        }
    }
    async updateCartItem(req, res, next) {
        try {
            const cartItemId = parseInt(req.params.id);
            const { quantity } = req.body;
            const schema = joi_1.default.object({
                quantity: joi_1.default.number().integer().positive().required(),
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
        }
        catch (error) {
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
    async removeCartItem(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async clearCart(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
