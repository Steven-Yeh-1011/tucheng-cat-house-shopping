export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    shipping_method: string;
    shipping_cost: number;
    shipping_address?: string;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    created_at: Date;
    updated_at: Date;
}
export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: Date;
}
export interface CreateOrderRequest {
    items: Array<{
        product_id: number;
        quantity: number;
        price: number;
    }>;
    shipping_method: string;
    shipping_cost: number;
    shipping_address?: string;
    recipient_name?: string;
    recipient_phone?: string;
    recipient_email?: string;
}
export interface OrderWithItems extends Order {
    items: Array<OrderItem & {
        product_name?: string;
        product_image?: string;
    }>;
}
//# sourceMappingURL=order.types.d.ts.map