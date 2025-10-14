import { apiClient as api } from './api';

export interface ShippingStore {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export interface ShippingCalculation {
  shippingCost: number;
  totalAmount: number;
  estimatedDays: number;
}

export interface ShippingCalculationRequest {
  shippingMethod: 'seven-eleven' | 'shopee' | 'home-delivery';
  storeId?: string;
  address?: string;
  totalAmount: number;
}

export const shippingService = {
  // 取得 7-11 門市
  getSevenElevenStores: async (city?: string, district?: string): Promise<ShippingStore[]> => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (district) params.append('district', district);
    
    const response = await api.get(`/shipping/seven-eleven/stores?${params.toString()}`);
    return response.data.data || [];
  },

  // 取得蝦皮門市
  getShopeeStores: async (city?: string, district?: string): Promise<ShippingStore[]> => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (district) params.append('district', district);
    
    const response = await api.get(`/shipping/shopee/stores?${params.toString()}`);
    return response.data.data || [];
  },

  // 取得縣市列表
  getCities: async (): Promise<string[]> => {
    const response = await api.get('/shipping/cities');
    return response.data.data || [];
  },

  // 取得鄉鎮區列表
  getDistricts: async (city: string): Promise<string[]> => {
    const response = await api.get(`/shipping/districts?city=${encodeURIComponent(city)}`);
    return response.data.data || [];
  },

  // 計算運費
  calculateShipping: async (request: ShippingCalculationRequest): Promise<ShippingCalculation> => {
    const response = await api.post('/shipping/calculate', request);
    return response.data.data;
  },

  // 取得運送選項
  getShippingOptions: (): ShippingOption[] => [
    {
      id: 'seven-eleven',
      name: '7-11 店到店',
      cost: 70,
      description: '7-11 超商取貨，運費 NT$ 70',
    },
    {
      id: 'shopee',
      name: '蝦皮店到店',
      cost: 70,
      description: '蝦皮合作超商取貨，運費 NT$ 70',
    },
    {
      id: 'home-delivery',
      name: '宅配到家',
      cost: 90,
      description: '直接配送到府，運費 NT$ 90',
    },
  ],
};
