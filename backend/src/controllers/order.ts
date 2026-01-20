import { faker } from '@faker-js/faker'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { CreateOrderDto } from '../dto/order.dto'
import BadRequestError from '../errors/bad-request-error'
import NotFoundError from '../errors/not-found-error'
import Product from '../models/product'

class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData: CreateOrderDto = req.body

      // Проверка на наличие _id в базе
      // Преобразуем строковые ID в ObjectId для корректного поиска
      const productIds = orderData.items.map(
        (id) => new mongoose.Types.ObjectId(id),
      )

      const products = await Product.find({
        _id: { $in: productIds },
      })
        .select('_id price')
        .lean()

      // Проверяем все ли товары найдены
      if (products.length !== orderData.items.length) {
        const foundIds = products.map((p) => p._id.toString())
        const missingIds = orderData.items.filter(
          (id) => !foundIds.includes(id),
        )
        return next(
          new NotFoundError(`Товары не найдены: ${missingIds.join(', ')}`),
        )
      }

      // Проверяем что все товары продаются (имеют цену)
      const unavailableProducts = products.filter(
        (p) => p.price === null || p.price === undefined,
      )
      if (unavailableProducts.length > 0) {
        const unavailableIds = unavailableProducts.map((p) => p._id.toString())
        return next(
          new BadRequestError(
            `Товары недоступны для продажи: ${unavailableIds.join(', ')}`,
          ),
        )
      }

      // Расчет общей суммы и проверка с переданным total
      // После проверки на null/undefined, price гарантированно число
      const calculatedTotal = products.reduce(
        (sum, product) => sum + (product.price as number),
        0,
      )
      const tolerance = 0.01
      const isTotalValid =
        Math.abs(calculatedTotal - orderData.total) <= tolerance

      if (!isTotalValid) {
        return next(
          new BadRequestError(
            `Сумма заказа не совпадает. Рассчитано: ${calculatedTotal}, получено: ${orderData.total}`,
          ),
        )
      }

      // Генерация случайного ID заказа
      const orderId = faker.string.uuid()

      return res.status(201).json({
        id: orderId,
        total: orderData.total,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default OrderController
