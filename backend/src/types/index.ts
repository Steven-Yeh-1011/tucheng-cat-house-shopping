import { Request } from 'express';

// 擴展 Express Request 類型
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'user' | 'admin';
  };
}

// 資料庫相關類型
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// 用戶相關類型
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

// 商品相關類型
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

// 分類相關類型
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// 購物車相關類型
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

// 運送相關類型
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

// API 回應類型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// JWT Payload 類型
export interface JwtPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}
