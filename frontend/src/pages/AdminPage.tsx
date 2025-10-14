import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import orderService from '../services/orderService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Hook calls must be at the top level
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAllOrders(),
    enabled: user?.role === 'admin', // Only run query if user is admin
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      orderService.updateOrderStatus(orderId, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      alert('訂單狀態已更新');
    },
  });

  // 檢查管理員權限
  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <ErrorMessage>
          <h2>❌ 權限不足</h2>
          <p>您需要管理員權限才能訪問此頁面</p>
          <BackButton onClick={() => navigate('/')}>返回首頁</BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  const handleStatusChange = (orderId: number, newStatus: string) => {
    if (window.confirm(`確定要將訂單 #${orderId} 的狀態更改為 ${newStatus}？`)) {
      updateStatusMutation.mutate({ orderId, status: newStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: '待付款', color: '#f39c12' },
      paid: { text: '已付款', color: '#3498db' },
      shipped: { text: '已出貨', color: '#9b59b6' },
      delivered: { text: '已送達', color: '#27ae60' },
      cancelled: { text: '已取消', color: '#e74c3c' },
    };
    return statusMap[status] || { text: status, color: '#95a5a6' };
  };

  return (
    <Container>
      <Header>
        <h1>🔧 管理員後台</h1>
        <HeaderActions>
          <UserInfo>👤 {user.email}</UserInfo>
          <LogoutButton onClick={() => {
            authService.logout();
            navigate('/');
          }}>
            登出
          </LogoutButton>
        </HeaderActions>
      </Header>

      <TabBar>
        <Tab $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
          📦 訂單管理
        </Tab>
        <Tab $active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
          🛍️ 商品管理
        </Tab>
      </TabBar>

      {activeTab === 'orders' && (
        <Section>
          <SectionHeader>
            <h2>訂單管理</h2>
            <Stats>總訂單數: {orders.length}</Stats>
          </SectionHeader>

          {isLoading ? (
            <LoadingMessage>載入中...</LoadingMessage>
          ) : orders.length === 0 ? (
            <EmptyMessage>暫無訂單</EmptyMessage>
          ) : (
            <OrdersTable>
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>用戶郵箱</th>
                  <th>金額</th>
                  <th>運送方式</th>
                  <th>狀態</th>
                  <th>下單時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user_email}</td>
                    <td>NT$ {order.total_amount + order.shipping_cost}</td>
                    <td>{order.shipping_method}</td>
                    <td>
                      <StatusBadge $color={getStatusBadge(order.status).color}>
                        {getStatusBadge(order.status).text}
                      </StatusBadge>
                    </td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      <StatusSelect
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">待付款</option>
                        <option value="paid">已付款</option>
                        <option value="shipped">已出貨</option>
                        <option value="delivered">已送達</option>
                        <option value="cancelled">已取消</option>
                      </StatusSelect>
                    </td>
                  </tr>
                ))}
              </tbody>
            </OrdersTable>
          )}
        </Section>
      )}

      {activeTab === 'products' && (
        <Section>
          <SectionHeader>
            <h2>商品管理</h2>
            <AddButton onClick={() => alert('商品管理功能開發中...')}>
              ➕ 新增商品
            </AddButton>
          </SectionHeader>
          <EmptyMessage>商品管理功能開發中...</EmptyMessage>
        </Section>
      )}
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: var(--color-background);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--color-primary);
    margin: 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  color: var(--color-text-secondary);
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 2rem;
  background: ${props => props.$active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text)'};
  border: none;
  border-bottom: ${props => props.$active ? 'none' : '2px solid transparent'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px 8px 0 0;

  &:hover {
    background: ${props => props.$active ? 'var(--color-primary)' : 'var(--color-background)'};
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    margin: 0;
    color: var(--color-text);
  }
`;

const Stats = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--color-success);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  h2 {
    color: var(--color-error);
    margin-bottom: 1rem;
  }
`;

const BackButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    background: var(--color-background);
    color: var(--color-text);
    font-weight: 600;
  }

  tbody tr:hover {
    background: var(--color-background);
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export default AdminPage;


