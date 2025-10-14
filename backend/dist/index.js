"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const shippingRoutes_1 = __importDefault(require("./routes/shippingRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8011;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3011',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/shipping', shippingRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '土城貓舍購物網 API 正常運行',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
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
        admin: '/api/admin'
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '找不到此路由'
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '伺服器內部錯誤',
        details: err.details || null
    });
});
app.listen(PORT, () => {
    console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
    console.log(`🏥 健康檢查: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map