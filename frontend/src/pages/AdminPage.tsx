import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import orderService from '../services/orderService';
import { productService, Product, Category } from '../services/productService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Hook calls must be at the top level
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAllOrders(),
    enabled: user?.role === 'admin',
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAllProducts(),
    enabled: user?.role === 'admin' && activeTab === 'products',
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getAllCategories(),
    enabled: user?.role === 'admin' && activeTab === 'products',
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      orderService.updateOrderStatus(orderId, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      alert('訂單狀態已更新');
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const product = await productService.createProduct(data);
      if (imageFile) {
        await productService.uploadProductImage(product.id, imageFile);
      }
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowProductModal(false);
      resetProductForm();
      alert('商品創建成功');
    },
    onError: (error: any) => {
      alert('創建失敗：' + (error.response?.data?.detail || error.message));
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const product = await productService.updateProduct(id, data);
      if (imageFile) {
        await productService.uploadProductImage(id, imageFile);
      }
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowProductModal(false);
      resetProductForm();
      alert('商品更新成功');
    },
    onError: (error: any) => {
      alert('更新失敗：' + (error.response?.data?.detail || error.message));
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      alert('商品刪除成功');
    },
    onError: (error: any) => {
      alert('刪除失敗：' + (error.response?.data?.detail || error.message));
    },
  });

  // 檢查管理員權限
  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <ErrorMessage>
          <h2>⛔ 權限不足</h2>
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
      pending: { text: '待處理', color: '#f39c12' },
      paid: { text: '已付款', color: '#3498db' },
      shipped: { text: '已出貨', color: '#9b59b6' },
      delivered: { text: '已送達', color: '#27ae60' },
      cancelled: { text: '已取消', color: '#e74c3c' },
    };
    return statusMap[status] || { text: status, color: '#95a5a6' };
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category_id: '',
      stock: '',
      image_url: '',
    });
    setImageFile(null);
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    resetProductForm();
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`確定要刪除商品「${name}」嗎？此操作無法撤銷。`)) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category_id: parseInt(productForm.category_id),
      stock: parseInt(productForm.stock),
      image_url: productForm.image_url || undefined,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Container>
      <Header>
        <h1>🛠️ 管理後台</h1>
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

          {ordersLoading ? (
            <LoadingMessage>載入中...</LoadingMessage>
          ) : orders.length === 0 ? (
            <EmptyMessage>暫無訂單</EmptyMessage>
          ) : (
            <OrdersTable>
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>用戶信箱</th>
                  <th>金額</th>
                  <th>配送方式</th>
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
                        <option value="pending">待處理</option>
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
            <AddButton onClick={handleAddProduct}>
              ➕ 新增商品
            </AddButton>
          </SectionHeader>

          {productsLoading ? (
            <LoadingMessage>載入中...</LoadingMessage>
          ) : products.length === 0 ? (
            <EmptyMessage>暫無商品</EmptyMessage>
          ) : (
            <ProductsGrid>
              {products.map((product: Product) => (
                <ProductCard key={product.id}>
                  <ProductImage>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </ProductImage>
                  <ProductInfo>
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <div className="details">
                      <span className="price">NT$ {product.price}</span>
                      <span className="stock">庫存: {product.stock}</span>
                    </div>
                    <div className="category">
                      分類: {product.category_name || product.category_id}
                    </div>
                  </ProductInfo>
                  <ProductActions>
                    <EditButton onClick={() => handleEditProduct(product)}>
                      ✏️ 編輯
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteProduct(product.id, product.name)}>
                      🗑️ 刪除
                    </DeleteButton>
                  </ProductActions>
                </ProductCard>
              ))}
            </ProductsGrid>
          )}
        </Section>
      )}

      {showProductModal && (
        <Modal>
          <ModalOverlay onClick={() => setShowProductModal(false)} />
          <ModalContent>
            <ModalHeader>
              <h2>{editingProduct ? '編輯商品' : '新增商品'}</h2>
              <CloseButton onClick={() => setShowProductModal(false)}>✕</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleProductSubmit}>
              <FormGroup>
                <label>商品名稱 *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>商品描述 *</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={4}
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>價格 (NT$) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>庫存數量 *</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>商品分類 *</label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  required
                >
                  <option value="">請選擇分類</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>圖片網址（選填）</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>

              <FormGroup>
                <label>或上傳圖片檔案</label>
                <FileInput>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFile && <span>已選擇: {imageFile.name}</span>}
                </FileInput>
              </FormGroup>

              {(imageFile || productForm.image_url) && (
                <ImagePreview>
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : productForm.image_url}
                    alt="預覽"
                  />
                </ImagePreview>
              )}

              <FormActions>
                <CancelButton type="button" onClick={() => setShowProductModal(false)}>
                  取消
                </CancelButton>
                <SubmitButton type="submit">
                  {editingProduct ? '更新商品' : '創建商品'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: var(--color-background);
  padding: 1rem;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  h1 {
    color: var(--color-primary);
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
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
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.25rem;
  background: ${props => props.$active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text)'};
  border: none;
  border-bottom: ${props => props.$active ? 'none' : '2px solid transparent'};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  white-space: nowrap;
  transition: all var(--transition-normal);

  &:hover {
    background: ${props => props.$active ? 'var(--color-primary)' : 'var(--color-accent)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Section = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-md);
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.25rem;
  }
`;

const Stats = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
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
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.85rem;
    white-space: nowrap;
  }

  th {
    background: var(--color-accent);
    color: var(--color-text);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tbody tr:hover {
    background: var(--color-accent);
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-round);
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
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

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const ProductCard = styled.div`
  background: var(--color-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:active {
    transform: scale(0.98);
    box-shadow: var(--shadow-md);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    font-size: 4rem;
    opacity: 0.3;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;

  h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
    font-size: 1.1rem;
  }

  .description {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .price {
    color: var(--color-primary);
    font-weight: 600;
    font-size: 1.1rem;
  }

  .stock {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .category {
    color: var(--color-text-secondary);
    font-size: 0.85rem;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
`;

const EditButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);

  h2 {
    margin: 0;
    color: var(--color-text);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-text);
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text);
    font-weight: 600;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  textarea {
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const FileInput = styled.div`
  input[type="file"] {
    padding: 0.5rem;
  }

  span {
    display: block;
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }
`;

const ImagePreview = styled.div`
  margin-bottom: 1.5rem;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: var(--color-border);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

export default AdminPage;
