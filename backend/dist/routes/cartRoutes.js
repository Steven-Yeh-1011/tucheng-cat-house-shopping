"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CartController_1 = require("../controllers/CartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const cartController = new CartController_1.CartController();
router.get('/', auth_1.authenticateToken, (req, res, next) => cartController.getCart(req, res, next));
router.post('/', auth_1.authenticateToken, (req, res, next) => cartController.addToCart(req, res, next));
router.put('/:id', auth_1.authenticateToken, (req, res, next) => cartController.updateCartItem(req, res, next));
router.delete('/:id', auth_1.authenticateToken, (req, res, next) => cartController.removeCartItem(req, res, next));
router.delete('/', auth_1.authenticateToken, (req, res, next) => cartController.clearCart(req, res, next));
exports.default = router;
