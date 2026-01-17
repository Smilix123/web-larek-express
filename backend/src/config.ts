import 'dotenv/config'
import path from 'path'

interface IConfig {
  PORT: number
  DB_ADDRESS: string
  paths: {
    upload: string
    temp: string
  }
  cors: {
    origin: string
  }
}

const config: IConfig = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB_ADDRESS: process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek',
  paths: {
    upload: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
    temp:
      process.env.UPLOAD_PATH_TEMP ||
      path.join(process.cwd(), 'uploads', 'temp'),
  },
  cors: {
    origin: process.env.ORIGIN_ALLOW || '*',
  },
}

export default config
