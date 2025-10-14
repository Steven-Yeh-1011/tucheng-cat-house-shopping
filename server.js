const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 建立 Express 應用程式
const app = express();
const port = process.env.PORT || 10000;

// Supabase 客戶端設定
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

console.log(`[Supabase] URL: ${supabaseUrl}, service key length: ${supabaseServiceKey.length}`);

// 中介軟體設定
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS 設定
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://tucheng-cat-house-shopping-fdm7.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 路由定義

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '🐱 土城貓宅購物 API 服務運行中',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 健康檢查端點
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error && error.message.includes('relation "products" does not exist')) {
      return res.json({
        status: 'healthy',
        database: 'connected',
        message: 'Database connected, but products table not yet created',
        timestamp: new Date().toISOString()
      });
    }

    if (error) {
      throw error;
    }

    res.json({
      status: 'healthy',
      database: 'connected',
      message: 'All systems operational',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 商品相關 API
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      products: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      products: []
    });
  }
});

// 取得商品分類
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      categories: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      categories: []
    });
  }
});

// 取得單一商品
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: '商品未找到',
          product: null
        });
      }
      return res.status(500).json({
        success: false,
        error: error.message,
        product: null
      });
    }

    res.json({
      success: true,
      product: data
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      product: null
    });
  }
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// 錯誤處理中介軟體
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`🚀 土城貓宅購物 API 伺服器運行在 http://localhost:${port}`);
  console.log(`📊 健康檢查: http://localhost:${port}/api/health`);
  console.log(`🛍️ 商品 API: http://localhost:${port}/api/products`);
  console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
