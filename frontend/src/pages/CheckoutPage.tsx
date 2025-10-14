import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import { shippingService } from '../services/shippingService';

/**
 * 結帳頁面（可愛粉色手機版）
 */
export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartSummary, selectedTotalAmount } = useCart();
  const selectedItems = cartSummary.selectedItems;
  
  const [currentStep, setCurrentStep] = React.useState(1);
  const [shippingMethod, setShippingMethod] = React.useState<string>('');
  const [selectedStore, setSelectedStore] = React.useState<any>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<string>('');
  const [customerInfo, setCustomerInfo] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const shippingOptions = shippingService.getShippingOptions();
  const [stores, setStores] = React.useState<any[]>([]);
  const [storeSearchQuery, setStoreSearchQuery] = React.useState('');

  const handleShippingMethodChange = (method: string) => {
    setShippingMethod(method);
    setSelectedStore(null);
    setStoreSearchQuery('');
    
    if (method === 'seven-eleven') {
      setStores([
        { id: '1', name: '7-11 土城店', address: '新北市土城區中央路一段23號' },
        { id: '2', name: '7-11 板橋店', address: '新北市板橋區文化路二段56號' },
      ]);
    } else if (method === 'shopee') {
      setStores([
        { id: '1', name: '蝦皮店到店土城店', address: '新北市土城區中央路一段89號' },
        { id: '2', name: '蝦皮店到店板橋店', address: '新北市板橋區文化路二段12號' },
      ]);
    } else {
      setStores([]);
    }
  };

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
  };

  const handlePlaceOrder = () => {
    if (!shippingMethod) {
      alert('請選擇配送方式');
      return;
    }
    
    if ((shippingMethod === 'seven-eleven' || shippingMethod === 'shopee') && !selectedStore) {
      alert('請選擇取貨門市');
      return;
    }
    
    if (shippingMethod === 'home-delivery' && !customerInfo.address) {
      alert('請填寫收件地址');
      return;
    }
    
    if (!paymentMethod) {
      alert('請選擇付款方式');
      return;
    }

    // TODO: 實作送出訂單
    alert('訂單已送出！');
    navigate('/');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const shippingCost = shippingMethod ? 
    shippingOptions.find(opt => opt.id === shippingMethod)?.cost || 0 : 0;
  const totalAmount = selectedTotalAmount + shippingCost;

  if (selectedItems.length === 0) {
    return (
      <Container>
        <Header>
          <Title>💳 結帳</Title>
          <BackButton onClick={handleBackToCart}>
            ← 返回
          </BackButton>
        </Header>
        <EmptyMessage>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyTitle>購物車是空的</EmptyTitle>
          <EmptyText>請先添加商品到購物車</EmptyText>
          <BackButton onClick={handleBackToCart}>
            返回購物車
          </BackButton>
        </EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>💳 結帳</Title>
        <BackButton onClick={handleBackToCart}>
          ← 返回
        </BackButton>
      </Header>

      <ProgressBar>
        <ProgressStep $completed={currentStep > 1} $active={currentStep === 1}>
          <StepNumber>1</StepNumber>
          <StepText>配送</StepText>
        </ProgressStep>
        <ProgressConnector />
        <ProgressStep $completed={currentStep > 2} $active={currentStep === 2}>
          <StepNumber>2</StepNumber>
          <StepText>資料</StepText>
        </ProgressStep>
        <ProgressConnector />
        <ProgressStep $completed={currentStep > 3} $active={currentStep === 3}>
          <StepNumber>3</StepNumber>
          <StepText>付款</StepText>
        </ProgressStep>
        <ProgressConnector />
        <ProgressStep $completed={currentStep > 4} $active={currentStep === 4}>
          <StepNumber>4</StepNumber>
          <StepText>確認</StepText>
        </ProgressStep>
      </ProgressBar>

      <FormSection>
        {currentStep === 1 && (
          <>
            <SectionTitle>📦 選擇配送方式</SectionTitle>
            <ShippingOptions>
              {shippingOptions.map(option => (
                <ShippingOption
                  key={option.id}
                  $selected={shippingMethod === option.id}
                  onClick={() => handleShippingMethodChange(option.id)}
                >
                  <ShippingOptionHeader>
                    <ShippingOptionName>{option.name}</ShippingOptionName>
                    <ShippingOptionCost>+NT$ {option.cost}</ShippingOptionCost>
                  </ShippingOptionHeader>
                  <ShippingOptionDescription>{option.description}</ShippingOptionDescription>
                  
                  {(option.id === 'seven-eleven' || option.id === 'shopee') && 
                   shippingMethod === option.id && (
                    <>
                      <StoreSearchInput
                        type="text"
                        placeholder="🔍 搜尋門市..."
                        value={storeSearchQuery}
                        onChange={(e) => setStoreSearchQuery(e.target.value)}
                      />
                      <StoreList>
                        {stores
                          .filter(store => 
                            store.name.includes(storeSearchQuery) ||
                            store.address.includes(storeSearchQuery)
                          )
                          .map(store => (
                            <StoreItem
                              key={store.id}
                              $selected={selectedStore?.id === store.id}
                              onClick={() => handleStoreSelect(store)}
                            >
                              <StoreName>{store.name}</StoreName>
                              <StoreAddress>{store.address}</StoreAddress>
                            </StoreItem>
                          ))}
                      </StoreList>
                    </>
                  )}
                </ShippingOption>
              ))}
            </ShippingOptions>
          </>
        )}

        {currentStep === 2 && (
          <>
            <SectionTitle>📝 填寫收件資料</SectionTitle>
            <FormGroup>
              <Label>收件人姓名 *</Label>
              <Input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="請輸入收件人姓名"
              />
            </FormGroup>
            <FormGroup>
              <Label>聯絡電話 *</Label>
              <Input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="請輸入聯絡電話"
              />
            </FormGroup>
            <FormGroup>
              <Label>電子郵件</Label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="請輸入電子郵件"
              />
            </FormGroup>
            {shippingMethod === 'home-delivery' && (
              <FormGroup>
                <Label>收件地址 *</Label>
                <TextArea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="請輸入完整收件地址"
                />
              </FormGroup>
            )}
          </>
        )}

        {currentStep === 3 && (
          <>
            <SectionTitle>💰 選擇付款方式</SectionTitle>
            <PaymentOptions>
              <PaymentOption
                $selected={paymentMethod === 'credit-card'}
                onClick={() => setPaymentMethod('credit-card')}
              >
                <PaymentOptionName>💳 信用卡</PaymentOptionName>
              </PaymentOption>
              <PaymentOption
                $selected={paymentMethod === 'bank-transfer'}
                onClick={() => setPaymentMethod('bank-transfer')}
              >
                <PaymentOptionName>🏦 銀行轉帳</PaymentOptionName>
              </PaymentOption>
              <PaymentOption
                $selected={paymentMethod === 'cod'}
                onClick={() => setPaymentMethod('cod')}
              >
                <PaymentOptionName>💵 貨到付款</PaymentOptionName>
              </PaymentOption>
            </PaymentOptions>
          </>
        )}

        {currentStep === 4 && (
          <>
            <SectionTitle>✅ 確認訂單</SectionTitle>
            <ConfirmSection>
              <ConfirmBlock>
                <ConfirmTitle>📦 配送方式</ConfirmTitle>
                <ConfirmText>{shippingOptions.find(opt => opt.id === shippingMethod)?.name}</ConfirmText>
                {selectedStore && <ConfirmText>取貨門市：{selectedStore.name}</ConfirmText>}
                {customerInfo.address && <ConfirmText>收件地址：{customerInfo.address}</ConfirmText>}
              </ConfirmBlock>
              <ConfirmBlock>
                <ConfirmTitle>💰 付款方式</ConfirmTitle>
                <ConfirmText>
                  {paymentMethod === 'credit-card' ? '💳 信用卡' : 
                   paymentMethod === 'bank-transfer' ? '🏦 銀行轉帳' : '💵 貨到付款'}
                </ConfirmText>
              </ConfirmBlock>
            </ConfirmSection>
          </>
        )}

        <NavigationButtons>
          {currentStep > 1 && (
            <PrevButton onClick={() => setCurrentStep(currentStep - 1)}>
              ← 上一步
            </PrevButton>
          )}
          {currentStep < 4 ? (
            <NextButton
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 && !shippingMethod) ||
                (currentStep === 1 && (shippingMethod === 'seven-eleven' || shippingMethod === 'shopee') && !selectedStore) ||
                (currentStep === 2 && (!customerInfo.name || !customerInfo.phone)) ||
                (currentStep === 3 && !paymentMethod)
              }
            >
              下一步 →
            </NextButton>
          ) : (
            <PlaceOrderButton onClick={handlePlaceOrder}>
              ✨ 確認下單
            </PlaceOrderButton>
          )}
        </NavigationButtons>
      </FormSection>

      <OrderSummary>
        <SectionTitle>📋 訂單摘要</SectionTitle>
        
        <OrderItems>
          {selectedItems.map(item => (
            <OrderItem key={item.id}>
              <OrderItemInfo>
                <OrderItemName>{item.product.name}</OrderItemName>
                <OrderItemQuantity>數量：{item.quantity}</OrderItemQuantity>
              </OrderItemInfo>
              <OrderItemPrice>NT$ {(item.product.price * item.quantity).toLocaleString()}</OrderItemPrice>
            </OrderItem>
          ))}
        </OrderItems>

        <SummaryRow>
          <SummaryLabel>商品金額</SummaryLabel>
          <SummaryValue>NT$ {selectedTotalAmount.toLocaleString()}</SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>運費</SummaryLabel>
          <SummaryValue>NT$ {shippingCost.toLocaleString()}</SummaryValue>
        </SummaryRow>

        <TotalRow>
          <TotalLabel>總計</TotalLabel>
          <TotalValue>NT$ {totalAmount.toLocaleString()}</TotalValue>
        </TotalRow>
      </OrderSummary>
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

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
`;

const ProgressStep = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
`;

const StepNumber = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-round);
  background: ${props => 
    props.$completed ? 'var(--color-primary)' : 
    props.$active ? 'var(--color-primary)' : 'var(--color-border)'};
  color: ${props => 
    props.$completed || props.$active ? 'white' : 'var(--color-text-light)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all var(--transition-normal);
`;

const StepText = styled.div<{ $active?: boolean; $completed?: boolean }>`
  font-size: 0.75rem;
  color: ${props => 
    props.$completed || props.$active ? 'var(--color-primary)' : 'var(--color-text-light)'};
  font-weight: ${props => props.$active ? '700' : '500'};
`;

const ProgressConnector = styled.div`
  flex: 1;
  height: 2px;
  background: var(--color-border);
  margin: 0 0.25rem;
  margin-bottom: 1rem;
`;

const FormSection = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }

  &::placeholder {
    color: var(--color-text-light);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }

  &::placeholder {
    color: var(--color-text-light);
  }
`;

const ShippingOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ShippingOption = styled.div<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: var(--radius-lg);
  padding: 1rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: ${props => props.$selected ? 'var(--color-accent)' : 'white'};

  &:active {
    transform: scale(0.98);
  }
`;

const ShippingOptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ShippingOptionName = styled.div`
  font-weight: 700;
  color: var(--color-text);
  font-size: 1rem;
`;

const ShippingOptionCost = styled.div`
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1rem;
`;

const ShippingOptionDescription = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
`;

const StoreSearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  margin-top: 0.75rem;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }
`;

const StoreList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-top: 0.75rem;
  background: white;
`;

const StoreItem = styled.div<{ $selected?: boolean }>`
  padding: 0.75rem;
  cursor: pointer;
  background: ${props => props.$selected ? 'var(--color-accent)' : 'white'};
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-accent);
  }

  &:last-child {
    border-bottom: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StoreName = styled.div`
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const StoreAddress = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PaymentOption = styled.div<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: var(--radius-lg);
  padding: 1rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: ${props => props.$selected ? 'var(--color-accent)' : 'white'};

  &:active {
    transform: scale(0.98);
  }
`;

const PaymentOptionName = styled.div`
  font-weight: 700;
  color: var(--color-text);
  font-size: 1rem;
`;

const ConfirmSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ConfirmBlock = styled.div`
  background: var(--color-accent);
  border-radius: var(--radius-md);
  padding: 1rem;
`;

const ConfirmTitle = styled.div`
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const ConfirmText = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const PrevButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: all var(--transition-normal);

  &:hover {
    background: var(--color-accent);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NextButton = styled.button<{ disabled?: boolean }>`
  flex: 2;
  padding: 0.75rem 1.5rem;
  background: ${props => props.disabled ? '#E0E0E0' : 'var(--color-primary)'};
  color: ${props => props.disabled ? 'var(--color-text-light)' : 'white'};
  border: none;
  border-radius: var(--radius-lg);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 700;
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

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
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

const OrderSummary = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  bottom: 1rem;
`;

const OrderItems = styled.div`
  margin-bottom: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
`;

const OrderItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderItemName = styled.div`
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OrderItemQuantity = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
`;

const OrderItemPrice = styled.div`
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 0.5rem;
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`;
