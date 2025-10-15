import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import orderService, { Order } from '../services/orderService';

const OrderHistoryPage: React.FC = () => {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getMyOrders(),
  });

  if (isLoading) {
    return (
      <Container>
        <h1>📦 訂單歷史</h1>
        <LoadingMessage>載入中...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h1>📦 訂單歷史</h1>
        <ErrorMessage>載入訂單失敗，請稍後再試</ErrorMessage>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <h1>📦 訂單歷史</h1>
        <EmptyMessage>
          <p>您還沒有任何訂單</p>
          <p>快去選購心儀的商品吧！</p>
        </EmptyMessage>
      </Container>
    );
  }

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: '待付款',
      paid: '已付款',
      shipped: '已出貨',
      delivered: '已送達',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      pending: '#f39c12',
      paid: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c',
    };
    return colorMap[status] || '#95a5a6';
  };

  return (
    <Container>
      <Header>
        <h1>📦 訂單歷史</h1>
        <SubTitle>共 {orders.length} 筆訂單</SubTitle>
      </Header>

      <OrdersList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <OrderNumber>訂單編號: #{order.id}</OrderNumber>
              <OrderStatus $color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </OrderStatus>
            </OrderHeader>

            <OrderInfo>
              <InfoItem>
                <Label>下單時間:</Label>
                <Value>{new Date(order.created_at).toLocaleString()}</Value>
              </InfoItem>
              <InfoItem>
                <Label>運送方式:</Label>
                <Value>{order.shipping_method}</Value>
              </InfoItem>
              {order.shipping_address && (
                <InfoItem>
                  <Label>配送地址:</Label>
                  <Value>{order.shipping_address}</Value>
                </InfoItem>
              )}
            </OrderInfo>

            {order.items && order.items.length > 0 && (
              <OrderItems>
                {order.items.map((item) => (
                  <OrderItem key={item.id}>
                    {item.product_image && (
                      <ItemImage src={item.product_image} alt={item.product_name} />
                    )}
                    <ItemInfo>
                      <ItemName>{item.product_name || `商品 #${item.product_id}`}</ItemName>
                      <ItemDetails>
                        數量: {item.quantity} × NT$ {item.price}
                      </ItemDetails>
                    </ItemInfo>
                    <ItemTotal>NT$ {item.price * item.quantity}</ItemTotal>
                  </OrderItem>
                ))}
              </OrderItems>
            )}

            <OrderSummary>
              <SummaryRow>
                <span>商品金額</span>
                <span>NT$ {order.total_amount}</span>
              </SummaryRow>
              <SummaryRow>
                <span>運費</span>
                <span>NT$ {order.shipping_cost}</span>
              </SummaryRow>
              <TotalRow>
                <span>訂單總計</span>
                <span>NT$ {order.total_amount + order.shipping_cost}</span>
              </TotalRow>
            </OrderSummary>
          </OrderCard>
        ))}
      </OrdersList>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }
`;

const SubTitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-error);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);

  p:first-child {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: var(--color-text);
`;

const OrderStatus = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: var(--color-text-secondary);
  min-width: 80px;
`;

const Value = styled.span`
  color: var(--color-text);
`;

const OrderItems = styled.div`
  margin: 1rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.25rem;
`;

const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const ItemTotal = styled.div`
  font-weight: 600;
  color: var(--color-primary);
`;

const OrderSummary = styled.div`
  margin-top: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const TotalRow = styled(SummaryRow)`
  border-top: 2px solid var(--color-border);
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-primary);
`;

export default OrderHistoryPage;





