import cors from 'cors'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import config from './config'
import { errorHandler, notFoundHandler } from './middlewares/error-handler'
import { errorLogger, requestLogger } from './middlewares/logger'
import routes from './routes'

const app = express()

// CORS с настройками из config
app.use(
  cors({
    origin: config.cors.origin === '*' ? true : config.cors.origin,
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(requestLogger)

app.use('/', routes)

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

mongoose
  .connect(config.DB_ADDRESS)
  .then(() => {
    console.log('Успешное подключение к MongoDB')
  })
  .catch((err: Error) => {
    console.log(`Ошибка подключения к MongoDB: ${err.message}`)
    process.exit(1)
  })

// Корневой маршрут
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API WebLarek',
    version: '1.0.0',
    endpoints: {
      products: '/product',
      order: '/order',
      health: '/health',
    },
  })
})

// Обработка ошибок 404
app.use(notFoundHandler)

// Логгер ошибок
app.use(errorLogger)

// Централизованный обработчик ошибок
app.use(errorHandler)

app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`)
})
