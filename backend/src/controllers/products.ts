import { NextFunction, Request, Response } from 'express'
import mongoose, { Error } from 'mongoose'
import { CreateProductDto } from '../dto/product.dto'
import BadRequestError from '../errors/bad-request-error'
import ConflictError from '../errors/conflict-error'
import NotFoundError from '../errors/not-found-error'
import Product from '../models/product'

class ProductsController {
  static async getAllProducts(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const products = await Product.find({})

      const response = {
        items: products,
        total: products.length,
      }

      return res.status(200).send(response)
    } catch (error) {
      return next(error)
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        return next(new NotFoundError('Товар не найден'))
      }

      return res.status(200).json(product)
    } catch (error) {
      return next(error)
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: CreateProductDto = req.body
      const product = new Product(productData)
      await product.save()

      return res.status(201).json({
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price,
      })
    } catch (error) {
      // Если Mongoose вернул ошибку валидации.
      if (error instanceof Error.ValidationError) {
        return next(
          new BadRequestError('Ошибка валидации данных при создании товара'),
        )
      }

      // Обработка ошибки дубликата (MongoDB error code 11000)
      if (
        error instanceof mongoose.mongo.MongoServerError &&
        error.code === 11000
      ) {
        return next(new ConflictError('Товар с таким названием уже существует'))
      }

      return next(error)
    }
  }
}

export default ProductsController
