import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import { shippingService } from '../services/shippingService';

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

const ProgressBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ProgressStep = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: ${props => 
    props.$completed ? 'var(--salmon-pink)' : 
    props.$active ? 'var(--navy-blue)' : 'var(--border-light)'};
  color: ${props => 
    props.$completed || props.$active ? 'white' : 'var(--text-light)'};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;

  &:not(:last-child)::after {
    content: '→';
    margin-left: 10px;
    color: var(--text-light);
  }
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: var(--navy-blue);
  margin-bottom: 20px;
  font-size: 1.4rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--navy-blue);
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--navy-blue);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--navy-blue);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--navy-blue);
  }
`;

const ShippingOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ShippingOption = styled.div<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? 'var(--navy-blue)' : 'var(--border-light)'};
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#f0f4ff' : 'white'};

  &:hover {
    border-color: var(--navy-blue);
  }
`;

const ShippingOptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ShippingOptionName = styled.div`
  font-weight: bold;
  color: var(--navy-blue);
`;

const ShippingOptionCost = styled.div`
  color: var(--salmon-pink);
  font-weight: bold;
`;

const ShippingOptionDescription = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
`;

const StoreSearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 10px;

  &:focus {
    outline: none;
    border-color: var(--navy-blue);
  }
`;

const StoreList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  margin-top: 10px;
`;

const StoreItem = styled.div<{ $selected?: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  background: ${props => props.$selected ? '#f0f4ff' : 'white'};
  border-bottom: 1px solid var(--border-light);

  &:hover {
    background: #f0f4ff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StoreName = styled.div`
  font-weight: bold;
  color: var(--navy-blue);
  margin-bottom: 4px;
`;

const StoreAddress = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaymentOption = styled.div<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? 'var(--navy-blue)' : 'var(--border-light)'};
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#f0f4ff' : 'white'};

  &:hover {
    border-color: var(--navy-blue);
  }
`;

const PaymentOptionName = styled.div`
  font-weight: bold;
  color: var(--navy-blue);
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-light);

  &:last-child {
    border-bottom: none;
  }
`;

const OrderItemName = styled.div`
  color: var(--navy-blue);
  font-weight: bold;
`;

const OrderItemQuantity = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
`;

const OrderItemPrice = styled.div`
  color: var(--salmon-pink);
  font-weight: bold;
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
  font-size: 1.3rem;
`;

const TotalLabel = styled.span`
  color: var(--navy-blue);
  font-weight: bold;
`;

const TotalValue = styled.span`
  color: var(--salmon-pink);
  font-weight: bold;
`;

const PlaceOrderButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#ccc' : 'var(--salmon-pink)'};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.2rem;
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

/**
 * 結帳頁面
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
    
    // 載入門市資料
    if (method === 'seven-eleven') {
      // TODO: 實際載入 7-11 門市
      setStores([
        { id: '1', name: '7-11 土城店', address: '新北市土城區中央路一段123號' },
        { id: '2', name: '7-11 板橋店', address: '新北市板橋區文化路二段456號' },
      ]);
    } else if (method === 'shopee') {
      // TODO: 實際載入蝦皮門市
      setStores([
        { id: '1', name: '蝦皮店到店 土城店', address: '新北市土城區中央路一段789號' },
        { id: '2', name: '蝦皮店到店 板橋店', address: '新北市板橋區文化路二段012號' },
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
      alert('請選擇運送方式');
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

    // TODO: 實際送出訂單
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
          <Title>結帳</Title>
          <BackButton onClick={handleBackToCart}>
            ← 返回購物車
          </BackButton>
        </Header>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>購物車是空的</h2>
          <p>請先添加商品到購物車</p>
          <BackButton onClick={handleBackToCart}>
            返回購物車
          </BackButton>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>結帳</Title>
        <BackButton onClick={handleBackToCart}>
          ← 返回購物車
        </BackButton>
      </Header>

      <ProgressBar>
        <ProgressStep $completed={currentStep > 1} $active={currentStep === 1}>
          1. 運送方式
        </ProgressStep>
        <ProgressStep $completed={currentStep > 2} $active={currentStep === 2}>
          2. 收件資訊
        </ProgressStep>
        <ProgressStep $completed={currentStep > 3} $active={currentStep === 3}>
          3. 付款方式
        </ProgressStep>
        <ProgressStep $completed={currentStep > 4} $active={currentStep === 4}>
          4. 確認訂單
        </ProgressStep>
      </ProgressBar>

      <CheckoutContent>
        <FormSection>
          {currentStep === 1 && (
            <>
              <SectionTitle>選擇運送方式</SectionTitle>
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
                          placeholder="搜尋門市..."
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
              <SectionTitle>收件資訊</SectionTitle>
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
              <SectionTitle>付款方式</SectionTitle>
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
                  <PaymentOptionName>💰 貨到付款</PaymentOptionName>
                </PaymentOption>
              </PaymentOptions>
            </>
          )}

          {currentStep === 4 && (
            <>
              <SectionTitle>確認訂單</SectionTitle>
              <div>
                <h3>運送方式</h3>
                <p>{shippingOptions.find(opt => opt.id === shippingMethod)?.name}</p>
                {selectedStore && <p>取貨門市：{selectedStore.name}</p>}
                {customerInfo.address && <p>收件地址：{customerInfo.address}</p>}
              </div>
              <div style={{ marginTop: '20px' }}>
                <h3>付款方式</h3>
                <p>{paymentMethod === 'credit-card' ? '信用卡' : 
                    paymentMethod === 'bank-transfer' ? '銀行轉帳' : '貨到付款'}</p>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            {currentStep > 1 && (
              <BackButton onClick={() => setCurrentStep(currentStep - 1)}>
                上一步
              </BackButton>
            )}
            {currentStep < 4 ? (
              <button
                style={{
                  background: 'var(--navy-blue)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !shippingMethod) ||
                  (currentStep === 2 && (!customerInfo.name || !customerInfo.phone)) ||
                  (currentStep === 3 && !paymentMethod)
                }
              >
                下一步
              </button>
            ) : (
              <PlaceOrderButton onClick={handlePlaceOrder}>
                確認下單
              </PlaceOrderButton>
            )}
          </div>
        </FormSection>

        <OrderSummary>
          <SectionTitle>訂單摘要</SectionTitle>
          
          {selectedItems.map(item => (
            <OrderItem key={item.id}>
              <div>
                <OrderItemName>{item.product.name}</OrderItemName>
                <OrderItemQuantity>數量：{item.quantity}</OrderItemQuantity>
              </div>
              <OrderItemPrice>NT$ {(item.product.price * item.quantity).toLocaleString()}</OrderItemPrice>
            </OrderItem>
          ))}

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
      </CheckoutContent>
    </Container>
  );
};
