import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '獲取分類失敗'
      });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: '分類不存在'
        });
        return;
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '獲取分類失敗'
      });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: '分類創建成功',
        data: category
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '創建分類失敗'
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.updateCategory(id, req.body);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: '分類不存在'
        });
        return;
      }

      res.json({
        success: true,
        message: '分類更新成功',
        data: category
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '更新分類失敗'
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.categoryService.deleteCategory(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: '分類不存在'
        });
        return;
      }

      res.json({
        success: true,
        message: '分類刪除成功'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '刪除分類失敗'
      });
    }
  }
}

