import { DatabaseService } from './DatabaseService';
import { Store, ShippingCalculateRequest, ShippingCalculateResponse } from '../types';

/**
 * 物流服務類別
 * 處理 7-11、蝦皮店到店和宅配相關功能
 */
export class ShippingService {
  // 物流費用設定
  private static readonly SHIPPING_FEES = {
    seven_eleven: 70,  // 7-11 店到店 NT$ 70
    shopee: 70,        // 蝦皮店到店 NT$ 70
    home_delivery: 90, // 宅配到家 NT$ 90
  };

  /**
   * 計算運費
   */
  calculateShippingFee(request: ShippingCalculateRequest): ShippingCalculateResponse {
    let fee = 0;
    let estimatedDays = 3;

    switch (request.shipping_method) {
      case 'seven_eleven':
        fee = ShippingService.SHIPPING_FEES.seven_eleven;
        estimatedDays = 3;
        break;
      case 'shopee':
        fee = ShippingService.SHIPPING_FEES.shopee;
        estimatedDays = 3;
        break;
      case 'home_delivery':
        fee = ShippingService.SHIPPING_FEES.home_delivery;
        estimatedDays = 2;
        break;
      default:
        throw new Error('無效的配送方式');
    }

    return {
      shipping_method: request.shipping_method,
      shipping_fee: fee,
      estimated_days: estimatedDays,
    };
  }

  /**
   * 取得 7-11 門市列表
   * 支援縣市鄉鎮篩選和關鍵字搜尋
   */
  async getSevenElevenStores(params: {
    city?: string;
    district?: string;
    search?: string;
    limit?: number;
  }): Promise<Store[]> {
    // TODO: 實際整合 7-11 API
    // 這裡先使用模擬資料
    const mockStores: Store[] = [
      {
        store_id: '711-001',
        store_name: '台北車站門市',
        store_address: '台北市中正區北平西路3號',
        city: '台北市',
        district: '中正區',
        phone: '02-2312-3456',
        is_available: true,
      },
      {
        store_id: '711-002',
        store_name: '西門町門市',
        store_address: '台北市萬華區成都路27號',
        city: '台北市',
        district: '萬華區',
        phone: '02-2371-1234',
        is_available: true,
      },
      {
        store_id: '711-003',
        store_name: '板橋車站門市',
        store_address: '新北市板橋區縣民大道二段7號',
        city: '新北市',
        district: '板橋區',
        phone: '02-2959-1234',
        is_available: true,
      },
      {
        store_id: '711-004',
        store_name: '土城金城門市',
        store_address: '新北市土城區金城路一段101號',
        city: '新北市',
        district: '土城區',
        phone: '02-2260-5678',
        is_available: true,
      },
    ];

    let filteredStores = mockStores;

    // 縣市篩選
    if (params.city) {
      filteredStores = filteredStores.filter(store => store.city === params.city);
    }

    // 鄉鎮區篩選
    if (params.district) {
      filteredStores = filteredStores.filter(store => store.district === params.district);
    }

    // 關鍵字搜尋
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredStores = filteredStores.filter(store =>
        store.store_name.toLowerCase().includes(searchLower) ||
        store.store_address.toLowerCase().includes(searchLower)
      );
    }

    // 限制數量
    if (params.limit) {
      filteredStores = filteredStores.slice(0, params.limit);
    }

    return filteredStores;
  }

  /**
   * 取得蝦皮門市列表
   */
  async getShopeeStores(params: {
    city?: string;
    district?: string;
    search?: string;
    limit?: number;
  }): Promise<Store[]> {
    // TODO: 實際整合蝦皮 API
    // 這裡先使用模擬資料
    const mockStores: Store[] = [
      {
        store_id: 'shopee-001',
        store_name: '蝦皮台北車站店',
        store_address: '台北市中正區忠孝西路一段50號',
        city: '台北市',
        district: '中正區',
        is_available: true,
      },
      {
        store_id: 'shopee-002',
        store_name: '蝦皮板橋店',
        store_address: '新北市板橋區文化路一段188號',
        city: '新北市',
        district: '板橋區',
        is_available: true,
      },
      {
        store_id: 'shopee-003',
        store_name: '蝦皮土城店',
        store_address: '新北市土城區中央路三段88號',
        city: '新北市',
        district: '土城區',
        is_available: true,
      },
    ];

    let filteredStores = mockStores;

    if (params.city) {
      filteredStores = filteredStores.filter(store => store.city === params.city);
    }

    if (params.district) {
      filteredStores = filteredStores.filter(store => store.district === params.district);
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredStores = filteredStores.filter(store =>
        store.store_name.toLowerCase().includes(searchLower) ||
        store.store_address.toLowerCase().includes(searchLower)
      );
    }

    if (params.limit) {
      filteredStores = filteredStores.slice(0, params.limit);
    }

    return filteredStores;
  }

  /**
   * 取得台灣縣市列表
   */
  getCities(): string[] {
    return [
      '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
      '基隆市', '新竹市', '嘉義市',
      '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
      '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
    ];
  }

  /**
   * 取得縣市的鄉鎮區列表
   */
  getDistricts(city: string): string[] {
    const districtsMap: { [key: string]: string[] } = {
      '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
      '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區'],
      '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龜山區', '大園區', '觀音區', '新屋區', '龍潭區', '復興區'],
      // 可以繼續添加其他縣市...
    };

    return districtsMap[city] || [];
  }
}

