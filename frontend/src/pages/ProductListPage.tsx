import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import authService from '../services/authService';

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

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Title = styled.h1`
  color: var(--navy-blue);
  font-size: 2rem;
  margin: 0;
`;

const CartButton = styled.button`
  background: var(--navy-blue);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0d1a5c;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const AdminButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #c82333;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LoginButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #218838;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'var(--navy-blue)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--navy-blue)'};
  border: 2px solid var(--navy-blue);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--navy-blue);
    color: white;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--navy-blue);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: var(--cream);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: var(--text-light);
  font-size: 1.1rem;
`;

const ProductName = styled.h3`
  color: var(--navy-blue);
  margin-bottom: 10px;
  font-size: 1.2rem;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  color: var(--salmon-pink);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const AddToCartButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#ccc' : 'var(--navy-blue)'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  transition: background-color 0.2s ease;
  width: 100%;

  &:hover:not(:disabled) {
    background: #0d1a5c;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: var(--text-light);
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e74c3c;
  font-size: 1.1rem;
  padding: 40px 20px;
`;

/**
 * 商品列表頁面
 */
export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // 獲取當前用戶信息
  const currentUser = authService.getUser();
  const isAdmin = currentUser?.role === 'admin';

  // 取得商品列表
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery],
    queryFn: () => {
      if (searchQuery) {
        return productService.searchProducts(searchQuery);
      }
      if (selectedCategory) {
        return productService.getProductsByCategory(selectedCategory);
      }
      return productService.getAllProducts();
    },
  });

  // 取得分類列表
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getAllCategories,
  });

  const handleAddToCart = (productId: number) => {
    addToCart({ productId, quantity: 1 });
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // 重新載入頁面以更新用戶狀態
  };

  return (
    <Container>
      <Header>
        <Title>🐱 土城貓舍購物網</Title>
        <HeaderButtons>
          {currentUser ? (
            <>
              {isAdmin && (
                <AdminButton onClick={handleAdminClick}>
                  🔧 管理後台
                </AdminButton>
              )}
              <CartButton onClick={handleCartClick}>
                🛒 購物車
              </CartButton>
              <LoginButton onClick={handleLogout}>
                👤 登出 ({currentUser.email})
              </LoginButton>
            </>
          ) : (
            <>
              <CartButton onClick={handleCartClick}>
                🛒 購物車
              </CartButton>
              <LoginButton onClick={handleLoginClick}>
                🔑 登入
              </LoginButton>
            </>
          )}
        </HeaderButtons>
      </Header>

      <FilterBar>
        <FilterButton
          $active={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
        >
          全部商品
        </FilterButton>
        {categories.map(category => (
          <FilterButton
            key={category.id}
            $active={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </FilterButton>
        ))}
        <SearchInput
          type="text"
          placeholder="搜尋商品..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FilterBar>

      {isLoading && <LoadingSpinner>載入中...</LoadingSpinner>}
      
      {error && (
        <ErrorMessage>
          載入商品時發生錯誤，請稍後再試
        </ErrorMessage>
      )}

      {!isLoading && !error && products.length === 0 && (
        <ErrorMessage>
          {searchQuery ? '找不到符合搜尋條件的商品' : '暫無商品'}
        </ErrorMessage>
      )}

      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                '商品圖片'
              )}
            </ProductImage>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>NT$ {product.price.toLocaleString()}</ProductPrice>
            <AddToCartButton
              onClick={() => handleAddToCart(product.id)}
              disabled={isAddingToCart || product.stock === 0}
            >
              {product.stock === 0 ? '缺貨中' : '加入購物車'}
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};
