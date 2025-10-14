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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  background: var(--color-background);
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  background: var(--color-background);
  border-radius: 12px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  color: var(--color-text);
  margin: 0;
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  color: var(--color-primary);
  font-weight: 600;
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
  border: 1px solid var(--color-border);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: var(--color-background);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BuyNowButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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


