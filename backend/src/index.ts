import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { DatabaseService } from './services/DatabaseService';
import { AuthService } from './services/AuthService';
import { CategoryService } from './services/CategoryService';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import shippingRoutes from './routes/shippingRoutes';

// 載入環境變數
dotenv.config();

// 建立 Express 應用
const app = express();
const PORT = process.env.PORT || 8011;

// 中間件設定
app.use(helmet()); // 安全性標頭
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
})); // 跨域請求
app.use(morgan('combined')); // 請求日誌
app.use(express.json({ limit: '10mb' })); // JSON 解析
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL 編碼解析

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '土城貓舍購物網 API 正常運行',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API 根路由
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '歡迎使用土城貓舍購物網 API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/shipping', shippingRoutes);

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '找不到請求的資源'
    }
  });
});

// 全域錯誤處理
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ 未處理的錯誤:', error);
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || '伺服器內部錯誤',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    }
  });
});

/**
 * 初始化應用程式
 * - 測試資料庫連接
 * - 建立管理員帳號
 * - 初始化分類
 */
async function initialize() {
  try {
    console.log('🚀 開始初始化土城貓舍購物網 API...');

    // 測試資料庫連接
    const dbConnected = await DatabaseService.testConnection();
    if (!dbConnected) {
      throw new Error('資料庫連接失敗');
    }

    // 建立管理員帳號
    await AuthService.createAdminAccount();

    // 初始化商品分類
    const categoryService = new CategoryService();
    await categoryService.initializeCategories();

    console.log('✅ 初始化完成');
  } catch (error: any) {
    console.error('❌ 初始化失敗:', error.message);
    process.exit(1);
  }
}

// 啟動伺服器
async function startServer() {
  await initialize();

  app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║   🐱 土城貓舍購物網 API 伺服器啟動      ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║   📡 伺服器地址: http://localhost:${PORT}    ║`);
    console.log(`║   🏥 健康檢查: /health                    ║`);
    console.log(`║   📚 API 文件: /api                       ║`);
    console.log(`║   🌍 環境: ${process.env.NODE_ENV || 'development'}                    ║`);
    console.log('╚═══════════════════════════════════════════╝\n');
  });
}

// 優雅關閉
process.on('SIGTERM', async () => {
  console.log('⚠️  收到 SIGTERM 信號，開始關閉伺服器...');
  await DatabaseService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️  收到 SIGINT 信號，開始關閉伺服器...');
  await DatabaseService.close();
  process.exit(0);
});

// 啟動應用
startServer().catch((error) => {
  console.error('❌ 伺服器啟動失敗:', error);
  process.exit(1);
});

export default app;

