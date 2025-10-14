import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('密碼和確認密碼不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密碼長度至少需要 6 個字符');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(formData.email, formData.password);
      alert('註冊成功！請登入');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '註冊失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Logo>🐱</Logo>
        <Title>土城貓舍購物網</Title>
        <Subtitle>會員註冊</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>電子郵件</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="請輸入電子郵件"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>密碼</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="至少 6 個字符"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>確認密碼</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="請再次輸入密碼"
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '註冊中...' : '註冊'}
          </SubmitButton>
        </Form>

        <Footer>
          <span>已經有帳號？</span>
          <StyledLink to="/login">立即登入</StyledLink>
        </Footer>

        <BackLink onClick={() => navigate('/')}>← 返回首頁</BackLink>
      </RegisterCard>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFE4E1 0%, #FFB3D9 50%, #FF69B4 100%);
  padding: 1rem;
  overflow-x: hidden;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 100%;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s ease;
`;

const Logo = styled.div`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 0.75rem;
  animation: bounce 2s ease-in-out infinite;
`;

const Title = styled.h1`
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.35rem;
  font-weight: 700;
`;

const Subtitle = styled.h2`
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background: #FFE4E1;
  color: var(--color-error);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
  border: 2px solid var(--color-error);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
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

const SubmitButton = styled.button`
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
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
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const BackLink = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem 0;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default RegisterPage;



