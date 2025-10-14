import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setIsLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      navigate('/'); // 登入成功後返回首頁
    } catch (err: any) {
      setError(err.response?.data?.message || '登入失敗，請檢查您的帳號和密碼');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Logo>🐱</Logo>
        <Title>土城貓舍購物網</Title>
        <Subtitle>會員登入</Subtitle>

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
              placeholder="請輸入密碼"
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '登入中...' : '登入'}
          </SubmitButton>
        </Form>

        <AdminButtons>
          <AdminButton 
            type="button" 
            onClick={() => setFormData({ email: 'cat750417@gmail.com', password: 'Bowbow520' })}
          >
            🔧 快速登入管理員
          </AdminButton>
        </AdminButtons>

        <Footer>
          <span>還沒有帳號？</span>
          <StyledLink to="/register">立即註冊</StyledLink>
        </Footer>

        <BackLink onClick={() => navigate('/')}>← 返回首頁</BackLink>
      </LoginCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Subtitle = styled.h2`
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 1.2rem;
  font-weight: normal;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AdminButtons = styled.div`
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
`;

const AdminButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
    color: #495057;
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

export default LoginPage;


