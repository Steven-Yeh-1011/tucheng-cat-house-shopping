import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import authService from '../services/authService';

/**
 * ?��??�表?�面（可?��??��?機�?�? */
export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // ?��??�戶信息
  const currentUser = authService.getUser();
  const isAdmin = currentUser?.role === 'admin';

  // ?��??��??�表
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

  // ?��??��??�表
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
    window.location.reload();
  };

  return (
    <Container>
      <Header>
        <Title>?�� ?��?貓�?購物�?/Title>
        <HeaderButtons>
          {currentUser ? (
            <>
              {isAdmin && (
                <AdminButton onClick={handleAdminClick}>
                  ??�?管�?後台
                </AdminButton>
              )}
              <CartButton onClick={handleCartClick}>
                ?? 購物�?              </CartButton>
              <LogoutButton onClick={handleLogout}>
                ?? ?�出
              </LogoutButton>
            </>
          ) : (
            <>
              <CartButton onClick={handleCartClick}>
                ?? 購物�?              </CartButton>
              <LoginButton onClick={handleLoginClick}>
                ?? ?�入
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
          ?�部?��?
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
      </FilterBar>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="?? ?��??��?..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      {isLoading && (
        <LoadingContainer>
          <LoadingSpinner>?��</LoadingSpinner>
          <LoadingText>載入�?..</LoadingText>
        </LoadingContainer>
      )}
      
      {error && (
        <ErrorMessage>
          <ErrorIcon>?��</ErrorIcon>
          <ErrorText>載入?��??�發?�錯誤�?請�?後�?�?/ErrorText>
        </ErrorMessage>
      )}

      {!isLoading && !error && products.length === 0 && (
        <EmptyMessage>
          <EmptyIcon>??</EmptyIcon>
          <EmptyText>
            {searchQuery ? '?��??�符?��?尋�?件�??��?' : '?�無?��?'}
          </EmptyText>
        </EmptyMessage>
      )}

      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
            <ProductImage>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                />
              ) : (
                <PlaceholderIcon>?��</PlaceholderIcon>
              )}
            </ProductImage>
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>NT$ {product.price.toLocaleString()}</ProductPrice>
              <StockInfo $inStock={product.stock > 0}>
                {product.stock > 0 ? `庫�?: ${product.stock}` : '缺貨�?}
              </StockInfo>
            </ProductInfo>
            <AddToCartButton
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product.id);
              }}
              disabled={isAddingToCart || product.stock === 0}
            >
              {product.stock === 0 ? '?�� 缺貨�? : '?? ?�入購物�?}
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

// Styled Components（可?��??��?機�?�?const Container = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 1rem;
  background: var(--color-background);
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  color: var(--color-primary);
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
`;

const CartButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 0.9rem;
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

const AdminButton = styled.button`
  background: #FF6B9D;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover {
    background: #FF1493;
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LoginButton = styled.button`
  background: #FFB3D9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover {
    background: #FF69B4;
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LogoutButton = styled.button`
  background: #FFC0CB;
  color: var(--color-text);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover {
    background: #FFB3D9;
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.5rem;

  /* ?��?滾�?條�?保�??�能 */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'var(--color-primary)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--color-primary)'};
  border: 2px solid var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all var(--transition-normal);
  box-shadow: ${props => props.$active ? 'var(--shadow-sm)' : 'none'};

  &:hover {
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SearchBar = styled.div`
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  background: white;
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const ProductCard = styled.div`
  background: var(--color-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    box-shadow: var(--shadow-md);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: var(--color-accent);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-md);
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  opacity: 0.3;
`;

const ProductInfo = styled.div`
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StockInfo = styled.div<{ $inStock: boolean }>`
  color: ${props => props.$inStock ? 'var(--color-success)' : 'var(--color-error)'};
  font-size: 0.85rem;
  font-weight: 600;
`;

const AddToCartButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#E0E0E0' : 'var(--color-primary)'};
  color: ${props => props.disabled ? 'var(--color-text-light)' : 'white'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  font-size: 3rem;
  animation: bounce 1s ease-in-out infinite;
`;

const LoadingText = styled.div`
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.div`
  color: var(--color-error);
  font-size: 1rem;
  font-weight: 600;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.div`
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 600;
`;
