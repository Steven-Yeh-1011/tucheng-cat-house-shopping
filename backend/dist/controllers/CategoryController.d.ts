import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    getAllCategories(req: Request, res: Response): Promise<void>;
    getCategoryById(req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    updateCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CategoryController.d.ts.map