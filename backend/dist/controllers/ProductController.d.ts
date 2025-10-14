import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    getAllProducts(req: Request, res: Response): Promise<void>;
    getProductById(req: Request, res: Response): Promise<void>;
    createProduct(req: Request, res: Response): Promise<void>;
    updateProduct(req: Request, res: Response): Promise<void>;
    deleteProduct(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ProductController.d.ts.map