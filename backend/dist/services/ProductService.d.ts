import { DatabaseService } from './DatabaseService';
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    stock: number;
    image_url?: string;
    created_at: Date;
    updated_at: Date;
}
export declare class ProductService {
    private db;
    constructor(databaseService: DatabaseService);
    getAllProducts(): Promise<Product[]>;
    getProductById(id: number): Promise<Product | null>;
    createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    updateProduct(id: number, productData: Partial<Product>): Promise<Product | null>;
    deleteProduct(id: number): Promise<boolean>;
    updateStock(id: number, quantity: number): Promise<boolean>;
}
//# sourceMappingURL=ProductService.d.ts.map