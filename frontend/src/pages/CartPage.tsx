import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';

/**
 * 購物車頁面（可愛粉色手機版）
 */
export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedItems,
    selectedTotalAmount,
    toggleItemSelection,
    toggleSelectAll,
    updateQuantity,
    removeItem,
    isUpdatingQuantity,
    isRemovingItem,
  } = useCart();

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    if (window.confirm('確定要移除這個商品嗎？')) {
      removeItem(itemId);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert('請選擇要結帳的商品');
      return;
    }
    navigate('/checkout');
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

  if (cartItems.length === 0) {
    return (
      <Container>
        <Header>
          <Title>🛒 購物車</Title>
          <BackButton onClick={handleBackToShopping}>
            ← 返回
          </BackButton>
        </Header>

        <EmptyCart>
          <EmptyCartIcon>🛒</EmptyCartIcon>
          <EmptyCartTitle>購物車是空的</EmptyCartTitle>
          <EmptyCartText>還沒有添加任何商品到購物車</EmptyCartText>
          <GoShoppingButton onClick={handleBackToShopping}>
            開始購物
          </GoShoppingButton>
        </EmptyCart>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🛒 購物車</Title>
        <BackButton onClick={handleBackToShopping}>
          ← 返回
        </BackButton>
      </Header>

      <CartContent>
        <CartItems>
          <SelectAllBar>
            <SelectAllCheckbox
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
            />
            <SelectAllLabel>全選</SelectAllLabel>
          </SelectAllBar>

          {cartItems.map(item => (
            <CartItem key={item.id}>
              <ItemCheckbox
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleItemSelection(item.id)}
              />
              
              <ItemImage>
                {item.product.image_url ? (
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                  />
                ) : (
                  <PlaceholderIcon>📦</PlaceholderIcon>
                )}
              </ItemImage>

              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemCategory>{item.product.category_name || '未分類'}</ItemCategory>
                <ItemPrice>NT$ {item.product.price.toLocaleString()}</ItemPrice>
              </ItemInfo>

              <ItemActions>
                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdatingQuantity}
                  >
                    −
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    disabled={isUpdatingQuantity}
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={isUpdatingQuantity}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>

                <RemoveButton
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isRemovingItem}
                >
                  🗑️
                </RemoveButton>
              </ItemActions>
            </CartItem>
          ))}
        </CartItems>

        <SummaryCard>
          <SummaryTitle>💰 訂單摘要</SummaryTitle>
          
          <SummaryRow>
            <SummaryLabel>商品總數</SummaryLabel>
            <SummaryValue>{selectedItems.size} 件</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>商品金額</SummaryLabel>
            <SummaryValue>NT$ {selectedTotalAmount.toLocaleString()}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>運費</SummaryLabel>
            <SummaryValue>待計算</SummaryValue>
          </SummaryRow>

          <TotalRow>
            <TotalLabel>總計</TotalLabel>
            <TotalValue>NT$ {selectedTotalAmount.toLocaleString()}</TotalValue>
          </TotalRow>

          <CheckoutButton
            onClick={handleCheckout}
            disabled={selectedItems.size === 0}
          >
            💳 前往結帳
          </CheckoutButton>
        </SummaryCard>
      </CartContent>
    </Container>
  );
};

// Styled Components（可愛粉色手機版）
const Container = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 1rem;
  background: var(--color-background);
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
`;

const Title = styled.h1`
  color: var(--color-primary);
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
`;

const BackButton = styled.button`
  background: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all var(--transition-normal);

  &:hover {
    background: var(--color-primary);
    color: white;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItems = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-md);
`;

const SelectAllBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
`;

const SelectAllCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-primary);
`;

const SelectAllLabel = styled.label`
  font-size: 1rem;
  color: var(--color-text);
  cursor: pointer;
  font-weight: 600;
`;

const CartItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-primary);
`;

const ItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background: var(--color-accent);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 2rem;
  opacity: 0.3;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h3`
  color: var(--color-text);
  margin-bottom: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ItemCategory = styled.div`
  color: var(--color-text-light);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  color: var(--color-primary);
  font-size: 1.1rem;
  font-weight: 700;
`;

const ItemActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-left: 2rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    background: #E0E0E0;
    color: var(--color-text-light);
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  padding: 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  /* 隱藏數字輸入框的上下箭頭 */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const RemoveButton = styled.button`
  background: transparent;
  color: var(--color-error);
  border: none;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.25rem;
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--color-accent);
  }

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SummaryCard = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  bottom: 1rem;
`;

const SummaryTitle = styled.h3`
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
`;

const SummaryLabel = styled.span`
  color: var(--color-text-secondary);
`;

const SummaryValue = styled.span`
  color: var(--color-text);
  font-weight: 600;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--color-border);
  font-size: 1.1rem;
`;

const TotalLabel = styled.span`
  color: var(--color-text);
  font-weight: 700;
`;

const TotalValue = styled.span`
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.25rem;
`;

const CheckoutButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#E0E0E0' : 'var(--color-primary)'};
  color: ${props => props.disabled ? 'var(--color-text-light)' : 'white'};
  border: none;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.1rem;
  font-weight: 700;
  width: 100%;
  margin-top: 1rem;
  box-shadow: ${props => props.disabled ? 'none' : 'var(--shadow-sm)'};
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
`;

const EmptyCartTitle = styled.h2`
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

const EmptyCartText = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`;

const GoShoppingButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.95);
  }
`;
