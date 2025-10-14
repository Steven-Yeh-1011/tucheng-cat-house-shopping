"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const ProductService_1 = require("../services/ProductService");
const DatabaseService_1 = require("../services/DatabaseService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const databaseService = new DatabaseService_1.DatabaseService();
const productService = new ProductService_1.ProductService(databaseService);
const productController = new ProductController_1.ProductController(productService);
router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, (req, res) => productController.createProduct(req, res));
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, (req, res) => productController.updateProduct(req, res));
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, (req, res) => productController.deleteProduct(req, res));
exports.default = router;
//# sourceMappingURL=productRoutes.js.map