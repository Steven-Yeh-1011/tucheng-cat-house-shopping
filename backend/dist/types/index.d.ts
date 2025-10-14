import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'user' | 'admin';
    };
}
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}
export interface User {
    id: number;
    email: string;
    password: string;
    role: 'user' | 'admin';
    created_at: Date;
    updated_at: Date;
}
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
export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}
export interface ShippingOption {
    id: string;
    name: string;
    cost: number;
    description: string;
}
export interface ShippingStore {
    id: string;
    name: string;
    address: string;
    store_id?: string;
    store_name?: string;
    store_address?: string;
    city?: string;
    district?: string;
    phone?: string;
    is_available?: boolean;
}
export interface ShippingCalculateRequest {
    method: string;
    addressDetails: {
        city?: string;
        district?: string;
        address?: string;
    };
}
export interface AddToCartRequest {
    productId: number;
    quantity: number;
}
export interface ShippingCalculateResponse {
    method: string;
    cost: number;
    estimatedDays: number;
    shipping_fee?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
export interface JwtPayload {
    userId: number;
    email: string;
    role: 'user' | 'admin';
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=index.d.ts.map