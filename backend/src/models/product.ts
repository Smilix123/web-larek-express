import { Document, model, Schema } from 'mongoose'

export interface IProductImage {
  fileName: string
  originalName: string
}

export interface IProduct extends Document {
  title: string
  image: IProductImage
  category: string
  description?: string
  price?: number | null
}

const ImageSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, 'Имя файла обязательно'],
    },
    originalName: {
      type: String,
      required: [true, 'Оригинальное имя файла обязательно'],
    },
  },
  { _id: false },
)

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Название товара обязательно'],
      minlength: [2, 'Название должно содержать минимум 2 символа'],
      maxlength: [30, 'Название не должно превышать 30 символов'],
      unique: true,
      trim: true,
    },
    image: {
      type: ImageSchema,
      required: [true, 'Изображение обязательно'],
    },
    category: {
      type: String,
      required: [true, 'Категория товара обязательна'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      default: null,
      min: [0, 'Цена не может быть отрицательной'],
      validate: {
        validator: function validatePrice(value: number | null) {
          return value === null || (typeof value === 'number' && value >= 0)
        },
        message: 'Цена должна быть null или положительным числом',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'product',
  },
)

export default model<IProduct>('product', productSchema)
