import { CartItem, AddToCartRequest } from '../types';
export declare class CartService {
    private databaseService;
    constructor();
    getCart(userId: number): Promise<CartItem[]>;
    addToCart(userId: number, data: AddToCartRequest): Promise<CartItem>;
    updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
    removeCartItem(cartItemId: number, userId: number): Promise<boolean>;
    clearCart(userId: number): Promise<boolean>;
    getCartTotal(userId: number): Promise<number>;
    getCartCount(userId: number): Promise<number>;
}
//# sourceMappingURL=CartService.d.ts.map