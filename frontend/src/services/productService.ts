import { apiClient as api } from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  stock: number;
  image_url?: string;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export const productService = {
  // 取得所有商品
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.products || [];
  },

  // 取得單一商品
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },

  // 取得所有分類
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.categories || [];
  },

  // 根據分類取得商品
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get(`/products?category_id=${categoryId}`);
    return response.data.products || [];
  },

  // 搜尋商品
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get(`/products?search=${encodeURIComponent(query)}`);
    return response.data.products || [];
  },
};
