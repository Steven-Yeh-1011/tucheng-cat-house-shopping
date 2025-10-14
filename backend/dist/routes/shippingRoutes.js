"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ShippingController_1 = require("../controllers/ShippingController");
const router = express_1.default.Router();
const shippingController = new ShippingController_1.ShippingController();
router.get('/seven-eleven/stores', (req, res, next) => shippingController.getSevenElevenStores(req, res, next));
router.get('/shopee/stores', (req, res, next) => shippingController.getShopeeStores(req, res, next));
router.post('/calculate', (req, res, next) => shippingController.calculateShippingFee(req, res, next));
router.get('/cities', (req, res, next) => shippingController.getCities(req, res, next));
router.get('/districts', (req, res, next) => shippingController.getDistricts(req, res, next));
exports.default = router;
