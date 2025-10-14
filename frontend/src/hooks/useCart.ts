import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    category_name?: string;
  };
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  selectedItems: CartItem[];
}

export const useCart = () => {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // 取得購物車內容
  const { data: cartItems = [], isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  // 加入商品到購物車
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) =>
      cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 更新商品數量
  const updateQuantityMutation = useMutation({
    mutationFn: (data: { itemId: number; quantity: number }) =>
      cartService.updateQuantity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 移除商品
  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: (_data, itemId) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // 從選中項目中移除
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    },
  });

  // 清空購物車
  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setSelectedItems(new Set());
    },
  });

  // 切換商品選中狀態
  const toggleItemSelection = useCallback((itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // 全選/取消全選
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  }, [selectedItems.size, cartItems]);

  // 計算購物車摘要
  const cartSummary: CartSummary = {
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    selectedItems: cartItems.filter(item => selectedItems.has(item.id)),
  };

  // 計算選中商品總金額
  const selectedTotalAmount = cartSummary.selectedItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  return {
    cartItems,
    selectedItems,
    cartSummary,
    selectedTotalAmount,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    toggleItemSelection,
    toggleSelectAll,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
};
