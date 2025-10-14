import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 導入路由
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import shippingRoutes from './routes/shippingRoutes';
import orderRoutes from './routes/orderRoutes';

// 載入環境變數
dotenv.config();

// 建立 Express 應用
const app = express();
const PORT = process.env.PORT || 8011;

// 中間件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3011',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // 開發日誌

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/orders', orderRoutes);

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '土城貓舍購物網 API 正常運行',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '歡迎來到土城貓舍購物網後端 API!',
    version: '1.0.0',
    docs: '/api-docs',
    auth: '/api/auth',
    products: '/api/products',
    categories: '/api/categories',
    cart: '/api/cart',
    shipping: '/api/shipping',
    orders: '/api/orders',
    admin: '/api/admin'
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到此路由'
  });
});

// 錯誤處理中間件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '伺服器內部錯誤',
    details: err.details || null
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
  console.log(`🏥 健康檢查: http://localhost:${PORT}/health`);
});

export default app;




