"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://localhost:3000'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.get('/', (req, res) => {
    res.json({
        message: '🐱 土城貓宅購物 API 服務運行中',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
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
    }
    catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json({
            success: true,
            products: data || [],
            count: data?.length || 0
        });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            products: []
        });
    }
});
app.get('/api/categories', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });
        if (error)
            throw error;
        res.json({
            success: true,
            categories: data || [],
            count: data?.length || 0
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            categories: []
        });
    }
});
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
            throw error;
        }
        res.json({
            success: true,
            product: data
        });
    }
    catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            product: null
        });
    }
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
app.listen(port, () => {
    console.log(`🚀 土城貓宅購物 API 伺服器運行在 http://localhost:${port}`);
    console.log(`📊 健康檢查: http://localhost:${port}/api/health`);
    console.log(`🛍️ 商品 API: http://localhost:${port}/api/products`);
    console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=simple-server.js.map