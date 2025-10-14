import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(Number(id)),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) =>
      cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      alert('已加入購物車！');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '加入購物車失敗');
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate({
        productId: product.id,
        quantity,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCartMutation.mutate(
        {
          productId: product.id,
          quantity,
        },
        {
          onSuccess: () => {
            navigate('/cart');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingMessage>載入中...</LoadingMessage>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <ErrorMessage>找不到此商品</ErrorMessage>
        <BackButton onClick={() => navigate('/')}>返回商品列表</BackButton>
      </Container>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <Container>
      <ProductWrapper>
        <ImageSection>
          {product.image_url ? (
            <ProductImage src={product.image_url} alt={product.name} />
          ) : (
            <ImagePlaceholder>🐱</ImagePlaceholder>
          )}
        </ImageSection>

        <InfoSection>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>NT$ {product.price}</ProductPrice>

          <ProductDescription>{product.description}</ProductDescription>

          <ProductMeta>
            <MetaItem>
              <MetaLabel>庫存狀態:</MetaLabel>
              <MetaValue $inStock={!isOutOfStock}>
                {isOutOfStock ? '缺貨中' : `${product.stock} 件`}
              </MetaValue>
            </MetaItem>
          </ProductMeta>

          <QuantitySection>
            <Label>數量:</Label>
            <QuantityControl>
              <QuantityButton
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
              >
                -
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min="1"
                max={product.stock}
                disabled={isOutOfStock}
              />
              <QuantityButton
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={isOutOfStock}
              >
                +
              </QuantityButton>
            </QuantityControl>
          </QuantitySection>

          <ButtonGroup>
            <AddToCartButton
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCartMutation.isPending}
            >
              {isOutOfStock ? '缺貨中' : '🛒 加入購物車'}
            </AddToCartButton>
            <BuyNowButton
              onClick={handleBuyNow}
              disabled={isOutOfStock || addToCartMutation.isPending}
            >
              {isOutOfStock ? '缺貨中' : '⚡ 立即購買'}
            </BuyNowButton>
          </ButtonGroup>

          <BackLink onClick={() => navigate('/')}>← 返回商品列表</BackLink>
        </InfoSection>
      </ProductWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 1rem;
  background: var(--color-background);
  overflow-x: hidden;
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
  font-size: 1.2rem;
`;

const BackButton = styled.button`
  margin: 2rem auto;
  display: block;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-md);
`;

const ImageSection = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  background: var(--color-accent);
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  background: var(--color-accent);
  border-radius: var(--radius-lg);
  opacity: 0.3;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductName = styled.h1`
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
  font-weight: 700;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 1.75rem;
  color: var(--color-primary);
  font-weight: 700;
`;

const ProductDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
`;

const MetaItem = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  color: var(--color-text-secondary);
`;

const MetaValue = styled.span<{ $inStock?: boolean }>`
  color: ${props => props.$inStock ? 'var(--color-success)' : 'var(--color-error)'};
  font-weight: 500;
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Label = styled.span`
  color: var(--color-text);
  font-weight: 500;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-primary);
  background: white;
  color: var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
  }

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #E0E0E0;
    color: var(--color-text-light);
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 36px;
  text-align: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  &:disabled {
    background: var(--color-background);
    opacity: 0.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const BuyNowButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  padding: 0;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default ProductDetailPage;


