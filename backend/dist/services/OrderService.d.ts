import { Order, CreateOrderRequest, OrderWithItems } from '../types/order.types';
export declare class OrderService {
    private db;
    constructor();
    createOrder(userId: number, orderData: CreateOrderRequest): Promise<Order>;
    getUserOrders(userId: number): Promise<OrderWithItems[]>;
    getOrderById(orderId: number, userId: number): Promise<OrderWithItems | null>;
    updateOrderStatus(orderId: number, status: Order['status']): Promise<Order>;
    getAllOrders(): Promise<OrderWithItems[]>;
}
//# sourceMappingURL=OrderService.d.ts.map