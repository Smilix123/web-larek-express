import { CelebrateError } from 'celebrate'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import BadRequestError from '../errors/bad-request-error'
import ConflictError from '../errors/conflict-error'
import NotFoundError from '../errors/not-found-error'

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500
  let message = 'Internal Server Error'

  if (error instanceof CelebrateError) {
    statusCode = 400
    // Извлекаем первое сообщение из деталей валидации
    const firstDetail = Array.from(error.details.values())[0]
    if (firstDetail && firstDetail.details && firstDetail.details.length > 0) {
      message = firstDetail.details[0].message
    } else {
      message = 'Ошибка валидации данных'
    }
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Ошибка валидации данных при создании товара'
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = 'Некорректный ID'
  } else if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    statusCode = 409
    message = 'Товар с таким названием уже существует'
  } else if (
    error instanceof BadRequestError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError
  ) {
    statusCode = error.statusCode
    message = error.message
  }

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    process.stderr.write(`Ошибка: ${error.message}\n`)
    if (error.stack) {
      process.stderr.write(`Stack: ${error.stack}\n`)
    }
  }

  res.status(statusCode).json({ message })
}

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError(`Маршрут ${req.originalUrl} не найден`))
}
