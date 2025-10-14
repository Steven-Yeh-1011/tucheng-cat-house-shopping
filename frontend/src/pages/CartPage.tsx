import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 2px solid var(--border-light);
`;

const Title = styled.h1`
  color: var(--navy-blue);
  font-size: 2rem;
  margin: 0;
`;

const BackButton = styled.button`
  background: var(--cream);
  color: var(--navy-blue);
  border: 2px solid var(--navy-blue);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--navy-blue);
    color: white;
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SelectAllBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-light);
`;

const SelectAllCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const SelectAllLabel = styled.label`
  font-size: 1.1rem;
  color: var(--navy-blue);
  cursor: pointer;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-light);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background: var(--cream);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: 0.9rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  color: var(--navy-blue);
  margin-bottom: 5px;
  font-size: 1.1rem;
`;

const ItemCategory = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const ItemPrice = styled.div`
  color: var(--salmon-pink);
  font-size: 1.2rem;
  font-weight: bold;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  background: var(--navy-blue);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #0d1a5c;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  padding: 8px;
  border: 2px solid var(--border-light);
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--navy-blue);
  }
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #c0392b;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
`;

const SummaryTitle = styled.h3`
  color: var(--navy-blue);
  margin-bottom: 20px;
  font-size: 1.3rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1rem;
`;

const SummaryLabel = styled.span`
  color: var(--text-light);
`;

const SummaryValue = styled.span`
  color: var(--navy-blue);
  font-weight: bold;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid var(--border-light);
  font-size: 1.2rem;
`;

const TotalLabel = styled.span`
  color: var(--navy-blue);
  font-weight: bold;
`;

const TotalValue = styled.span`
  color: var(--salmon-pink);
  font-weight: bold;
  font-size: 1.3rem;
`;

const CheckoutButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#ccc' : 'var(--salmon-pink)'};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.1rem;
  font-weight: bold;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #ff8a80;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyCartTitle = styled.h2`
  color: var(--navy-blue);
  margin-bottom: 10px;
`;

const EmptyCartText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const GoShoppingButton = styled.button`
  background: var(--navy-blue);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0d1a5c;
  }
`;

/**
 * 購物車頁面
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
          <Title>購物車</Title>
          <BackButton onClick={handleBackToShopping}>
            ← 繼續購物
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
        <Title>購物車</Title>
        <BackButton onClick={handleBackToShopping}>
          ← 繼續購物
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  '商品圖片'
                )}
              </ItemImage>

              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemCategory>{item.product.category_name || '未分類'}</ItemCategory>
                <ItemPrice>NT$ {item.product.price.toLocaleString()}</ItemPrice>
              </ItemInfo>

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
                移除
              </RemoveButton>
            </CartItem>
          ))}
        </CartItems>

        <SummaryCard>
          <SummaryTitle>訂單摘要</SummaryTitle>
          
          <SummaryRow>
            <SummaryLabel>商品總數</SummaryLabel>
            <SummaryValue>{selectedItems.size} 項</SummaryValue>
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
            前往結帳
          </CheckoutButton>
        </SummaryCard>
      </CartContent>
    </Container>
  );
};

