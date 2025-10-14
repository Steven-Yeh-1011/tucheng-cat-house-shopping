"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async getAllProducts(req, res) {
        try {
            const products = await this.productService.getAllProducts();
            res.json({
                success: true,
                data: products
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || '獲取商品失敗'
            });
        }
    }
    async getProductById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.getProductById(id);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: '商品不存在'
                });
                return;
            }
            res.json({
                success: true,
                data: product
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || '獲取商品失敗'
            });
        }
    }
    async createProduct(req, res) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({
                success: true,
                message: '商品創建成功',
                data: product
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || '創建商品失敗'
            });
        }
    }
    async updateProduct(req, res) {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.updateProduct(id, req.body);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: '商品不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '商品更新成功',
                data: product
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || '更新商品失敗'
            });
        }
    }
    async deleteProduct(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await this.productService.deleteProduct(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '商品不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '商品刪除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || '刪除商品失敗'
            });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map