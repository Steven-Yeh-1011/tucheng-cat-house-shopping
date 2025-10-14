import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class OrderController {
    private orderService;
    constructor();
    createOrder: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getUserOrders: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getOrderById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateOrderStatus: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllOrders: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=OrderController.d.ts.map