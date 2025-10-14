import { ShippingStore, ShippingCalculateRequest, ShippingCalculateResponse } from '../types';
export declare class ShippingService {
    private static readonly SHIPPING_FEES;
    calculateShippingFee(request: ShippingCalculateRequest): ShippingCalculateResponse;
    getSevenElevenShippingStores(params: {
        city?: string;
        district?: string;
        search?: string;
        limit?: number;
    }): Promise<ShippingStore[]>;
    getShopeeShippingStores(params: {
        city?: string;
        district?: string;
        search?: string;
        limit?: number;
    }): Promise<ShippingStore[]>;
    getCities(): string[];
    getDistricts(city: string): string[];
}
//# sourceMappingURL=ShippingService.d.ts.map