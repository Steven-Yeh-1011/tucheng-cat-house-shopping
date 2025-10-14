"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingController = void 0;
const ShippingService_1 = require("../services/ShippingService");
const joi_1 = __importDefault(require("joi"));
class ShippingController {
    constructor() {
        this.shippingService = new ShippingService_1.ShippingService();
    }
    async getSevenElevenStores(req, res, next) {
        try {
            const { city, district, search, limit } = req.query;
            const stores = await this.shippingService.getSevenElevenShippingStores({
                city: city,
                district: district,
                search: search,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: stores,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getShopeeStores(req, res, next) {
        try {
            const { city, district, search, limit } = req.query;
            const stores = await this.shippingService.getShopeeShippingStores({
                city: city,
                district: district,
                search: search,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: stores,
            });
        }
        catch (error) {
            next(error);
        }
    }
    calculateShippingFee(req, res, next) {
        try {
            const requestData = req.body;
            const schema = joi_1.default.object({
                method: joi_1.default.string()
                    .valid('seven_eleven', 'shopee', 'home_delivery')
                    .required(),
                city: joi_1.default.string().optional(),
                district: joi_1.default.string().optional(),
                weight: joi_1.default.number().positive().optional(),
            });
            const { error, value } = schema.validate(requestData);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: error.details[0].message,
                    },
                });
            }
            const result = this.shippingService.calculateShippingFee(value);
            return res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            if (error.message.includes('無效')) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: error.message,
                    },
                });
            }
            next(error);
        }
    }
    getCities(req, res, next) {
        try {
            const cities = this.shippingService.getCities();
            return res.json({
                success: true,
                data: cities,
            });
        }
        catch (error) {
            next(error);
        }
    }
    getDistricts(req, res, next) {
        try {
            const { city } = req.query;
            if (!city) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: '請提供縣市參數',
                    },
                });
            }
            const districts = this.shippingService.getDistricts(city);
            res.json({
                success: true,
                data: districts,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ShippingController = ShippingController;
