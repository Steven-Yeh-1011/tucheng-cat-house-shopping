import { DatabaseService } from './DatabaseService';
export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
}
export declare class CategoryService {
    private db;
    constructor(databaseService: DatabaseService);
    initializeCategories(): Promise<void>;
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category | null>;
    createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category>;
    updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | null>;
    deleteCategory(id: number): Promise<boolean>;
}
//# sourceMappingURL=CategoryService.d.ts.map