import express from 'express';
import { ShippingController } from '../controllers/ShippingController';

const router = express.Router();
const shippingController = new ShippingController();

/**
 * 物流相關路由
 */

// 取得 7-11 門市列表
router.get('/seven-eleven/stores', (req, res, next) => 
  shippingController.getSevenElevenStores(req, res, next)
);

// 取得蝦皮門市列表
router.get('/shopee/stores', (req, res, next) => 
  shippingController.getShopeeStores(req, res, next)
);

// 計算運費
router.post('/calculate', (req, res, next) => 
  shippingController.calculateShippingFee(req, res, next)
);

// 取得縣市列表
router.get('/cities', (req, res, next) => 
  shippingController.getCities(req, res, next)
);

// 取得鄉鎮區列表
router.get('/districts', (req, res, next) => 
  shippingController.getDistricts(req, res, next)
);

export default router;

