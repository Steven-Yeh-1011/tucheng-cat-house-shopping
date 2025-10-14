import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '獲取商品失敗'
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '獲取商品失敗'
      });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: '商品創建成功',
        data: product
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '創建商品失敗'
      });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '更新商品失敗'
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '刪除商品失敗'
      });
    }
  }
}

