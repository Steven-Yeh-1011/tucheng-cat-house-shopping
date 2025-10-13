import { Request, Response, NextFunction } from 'express';
import { ShippingService } from '../services/ShippingService';
import { ShippingCalculateRequest } from '../types';
import Joi from 'joi';

/**
 * 物流控制器
 * 處理物流相關的 HTTP 請求
 */
export class ShippingController {
  private shippingService: ShippingService;

  constructor() {
    this.shippingService = new ShippingService();
  }

  /**
   * 取得 7-11 門市列表
   */
  async getSevenElevenStores(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, district, search, limit } = req.query;

      const stores = await this.shippingService.getSevenElevenStores({
        city: city as string,
        district: district as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 取得蝦皮門市列表
   */
  async getShopeeStores(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, district, search, limit } = req.query;

      const stores = await this.shippingService.getShopeeStores({
        city: city as string,
        district: district as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 計算運費
   */
  calculateShippingFee(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData: ShippingCalculateRequest = req.body;

      // 驗證輸入
      const schema = Joi.object({
        shipping_method: Joi.string()
          .valid('seven_eleven', 'shopee', 'home_delivery')
          .required(),
        city: Joi.string().optional(),
        district: Joi.string().optional(),
        weight: Joi.number().positive().optional(),
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

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
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

  /**
   * 取得縣市列表
   */
  getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = this.shippingService.getCities();

      res.json({
        success: true,
        data: cities,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 取得鄉鎮區列表
   */
  getDistricts(req: Request, res: Response, next: NextFunction) {
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

      const districts = this.shippingService.getDistricts(city as string);

      res.json({
        success: true,
        data: districts,
      });
    } catch (error) {
      next(error);
    }
  }
}

