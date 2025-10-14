import { apiClient as api } from './api';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: 'user' | 'admin';
  };
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  // 登入
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data;

      // 檢查是否為管理員並設置角色
      if (this.isAdminEmail(email)) {
        data.user.role = 'admin';
      }

      // 儲存 token 和用戶資訊
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));

      // 設置 API 請求的 Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return data;
    } catch (error) {
      // 如果是管理員帳號，提供模擬登入
      if (this.isAdminEmail(email) && this.isValidAdminPassword(email, password)) {
        const mockUser = {
          id: email === 'cat750417@gmail.com' ? 2 : 1,
          email: email,
          role: 'admin' as const
        };

        const mockToken = this.generateMockToken(mockUser);
        const mockData = {
          token: mockToken,
          user: mockUser
        };

        // 儲存 token 和用戶資訊
        localStorage.setItem(this.tokenKey, mockToken);
        localStorage.setItem(this.userKey, JSON.stringify(mockUser));

        // 設置 API 請求的 Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

        return mockData;
      }
      
      // 重新拋出錯誤
      throw error;
    }
  }

  // 註冊
  async register(email: string, password: string): Promise<void> {
    await api.post('/auth/register', { email, password });
  }

  // 登出
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    delete api.defaults.headers.common['Authorization'];
  }

  // 獲取 token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 獲取用戶資訊
  getUser(): LoginResponse['user'] | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      // 硬編碼管理員檢查
      if (this.isAdminEmail(user.email)) {
        user.role = 'admin';
      }
      return user;
    } catch {
      return null;
    }
  }

  // 檢查是否為管理員郵箱
  private isAdminEmail(email: string): boolean {
    const adminEmails = [
      'cat750417@gmail.com',
      'diowyang1011@gmail.com'
    ];
    return adminEmails.includes(email);
  }

  // 驗證管理員密碼
  private isValidAdminPassword(email: string, password: string): boolean {
    const adminCredentials: { [key: string]: string } = {
      'cat750417@gmail.com': 'Bowbow520',
      'diowyang1011@gmail.com': '740827'
    };
    return adminCredentials[email] === password;
  }

  // 生成模擬 JWT Token
  private generateMockToken(user: any): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      sub: user.email,
      user_id: user.id,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小時過期
    }));
    const signature = btoa("mock_signature_" + Date.now());
    return `${header}.${payload}.${signature}`;
  }

  // 檢查是否已登入
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // 初始化 - 從 localStorage 恢復認證狀態
  initialize(): void {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

const authService = new AuthService();

// 應用啟動時初始化認證狀態
authService.initialize();

export default authService;


