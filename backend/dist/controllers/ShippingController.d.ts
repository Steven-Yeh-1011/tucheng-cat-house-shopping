import { Request, Response, NextFunction } from 'express';
export declare class ShippingController {
    private shippingService;
    constructor();
    getSevenElevenStores(req: Request, res: Response, next: NextFunction): Promise<void>;
    getShopeeStores(req: Request, res: Response, next: NextFunction): Promise<void>;
    calculateShippingFee(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    getCities(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    getDistricts(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=ShippingController.d.ts.map