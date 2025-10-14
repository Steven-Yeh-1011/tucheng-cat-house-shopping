"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingService = void 0;
class ShippingService {
    calculateShippingFee(request) {
        let fee = 0;
        let estimatedDays = 3;
        switch (request.method) {
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
            method: request.method,
            cost: fee,
            shipping_fee: fee,
            estimatedDays: estimatedDays,
        };
    }
    async getSevenElevenShippingStores(params) {
        const mockShippingStores = [
            {
                id: '711-001',
                name: '台北車站門市',
                address: '台北市中正區北平西路3號',
                store_id: '711-001',
                store_name: '台北車站門市',
                store_address: '台北市中正區北平西路3號',
                city: '台北市',
                district: '中正區',
                phone: '02-2312-3456',
                is_available: true,
            },
            {
                id: '711-002',
                name: '西門町門市',
                address: '台北市萬華區成都路27號',
                store_id: '711-002',
                store_name: '西門町門市',
                store_address: '台北市萬華區成都路27號',
                city: '台北市',
                district: '萬華區',
                phone: '02-2371-1234',
                is_available: true,
            },
            {
                id: '711-003',
                name: '板橋車站門市',
                address: '新北市板橋區縣民大道二段7號',
                store_id: '711-003',
                store_name: '板橋車站門市',
                store_address: '新北市板橋區縣民大道二段7號',
                city: '新北市',
                district: '板橋區',
                phone: '02-2959-1234',
                is_available: true,
            },
            {
                id: '711-004',
                name: '土城金城門市',
                address: '新北市土城區金城路一段101號',
                store_id: '711-004',
                store_name: '土城金城門市',
                store_address: '新北市土城區金城路一段101號',
                city: '新北市',
                district: '土城區',
                phone: '02-2260-5678',
                is_available: true,
            },
        ];
        let filteredShippingStores = mockShippingStores;
        if (params.city) {
            filteredShippingStores = filteredShippingStores.filter(store => store.city === params.city);
        }
        if (params.district) {
            filteredShippingStores = filteredShippingStores.filter(store => store.district === params.district);
        }
        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredShippingStores = filteredShippingStores.filter(store => store.name?.toLowerCase().includes(searchLower) ||
                store.address?.toLowerCase().includes(searchLower) ||
                store.store_name?.toLowerCase().includes(searchLower) ||
                store.store_address?.toLowerCase().includes(searchLower));
        }
        if (params.limit) {
            filteredShippingStores = filteredShippingStores.slice(0, params.limit);
        }
        return filteredShippingStores;
    }
    async getShopeeShippingStores(params) {
        const mockShippingStores = [
            {
                id: 'shopee-001',
                name: '蝦皮台北車站店',
                address: '台北市中正區忠孝西路一段50號',
                store_id: 'shopee-001',
                store_name: '蝦皮台北車站店',
                store_address: '台北市中正區忠孝西路一段50號',
                city: '台北市',
                district: '中正區',
                is_available: true,
            },
            {
                id: 'shopee-002',
                name: '蝦皮板橋店',
                address: '新北市板橋區文化路一段188號',
                store_id: 'shopee-002',
                store_name: '蝦皮板橋店',
                store_address: '新北市板橋區文化路一段188號',
                city: '新北市',
                district: '板橋區',
                is_available: true,
            },
            {
                id: 'shopee-003',
                name: '蝦皮土城店',
                address: '新北市土城區中央路三段88號',
                store_id: 'shopee-003',
                store_name: '蝦皮土城店',
                store_address: '新北市土城區中央路三段88號',
                city: '新北市',
                district: '土城區',
                is_available: true,
            },
        ];
        let filteredShippingStores = mockShippingStores;
        if (params.city) {
            filteredShippingStores = filteredShippingStores.filter(store => store.city === params.city);
        }
        if (params.district) {
            filteredShippingStores = filteredShippingStores.filter(store => store.district === params.district);
        }
        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredShippingStores = filteredShippingStores.filter(store => store.name?.toLowerCase().includes(searchLower) ||
                store.address?.toLowerCase().includes(searchLower) ||
                store.store_name?.toLowerCase().includes(searchLower) ||
                store.store_address?.toLowerCase().includes(searchLower));
        }
        if (params.limit) {
            filteredShippingStores = filteredShippingStores.slice(0, params.limit);
        }
        return filteredShippingStores;
    }
    getCities() {
        return [
            '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
            '基隆市', '新竹市', '嘉義市',
            '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
            '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
        ];
    }
    getDistricts(city) {
        const districtsMap = {
            '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
            '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區'],
            '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龜山區', '大園區', '觀音區', '新屋區', '龍潭區', '復興區'],
        };
        return districtsMap[city] || [];
    }
}
exports.ShippingService = ShippingService;
ShippingService.SHIPPING_FEES = {
    seven_eleven: 70,
    shopee: 70,
    home_delivery: 90,
};
