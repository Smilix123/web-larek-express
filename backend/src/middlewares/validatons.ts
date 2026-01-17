import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'

export const validateCreateProduct = celebrate(
  {
    [Segments.BODY]: Joi.object({
      title: Joi.string()
        .min(2)
        .max(30)
        .required()
        .label('Название товара')
        .messages({
          'string.min': 'Минимальная длина названия - 2 символа',
          'string.max': 'Максимальная длина названия - 30 символов',
        }),
      image: Joi.object({
        fileName: Joi.string().required().label('Имя файла'),
        originalName: Joi.string().required().label('Оригинальное имя'),
      })
        .required()
        .label('Изображение')
        .messages({
          'any.required': 'Необходимо загрузить изображение',
        }),
      category: Joi.string().required().label('Категория').messages({
        'string.empty': 'Выберите категорию товара',
      }),
      description: Joi.string().optional().label('Описание').messages({
        'string.base': 'Описание должно быть текстом',
      }),
      price: Joi.number().min(0).allow(null).optional().label('Цена').messages({
        'number.min': 'Цена не может быть отрицательной',
      }),
    }),
  },
  {
    abortEarly: false,
    messages: {
      'any.required': 'Поле {#label} обязательно для заполнения',
      'string.base': 'Поле {#label} должно быть текстом',
      'number.base': 'Поле {#label} должно быть числом',
    },
  },
)

// Валидация ID для маршрута GET /product/:id
export const validateProductId = celebrate(
  {
    [Segments.PARAMS]: Joi.object({
      id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
  { abortEarly: false },
)

export const validateCreateOrder = celebrate(
  {
    [Segments.BODY]: Joi.object({
      payment: Joi.string()
        .valid('card', 'online')
        .required()
        .label('Способ оплаты')
        .messages({
          'any.only':
            'Допустимые способы оплаты: "card" (карта) или "online" (онлайн)',
          'string.empty': 'Выберите способ оплаты',
        }),
      email: Joi.string().email().required().label('Email').messages({
        'string.email': 'Введите корректный email адрес',
        'string.empty': 'Email не может быть пустым',
      }),
      phone: Joi.string().required().label('Телефон').messages({
        'string.empty': 'Телефон не может быть пустым',
      }),
      address: Joi.string()
        .min(1)
        .max(500)
        .required()
        .label('Адрес доставки')
        .messages({
          'string.min': 'Адрес должен содержать хотя бы 1 символ',
          'string.max': 'Адрес не должен превышать 500 символов',
          'string.empty': 'Адрес не может быть пустым',
        }),
      total: Joi.number().positive().required().label('Общая сумма').messages({
        'number.positive': 'Сумма должна быть положительной',
        'number.base': 'Сумма должна быть числом',
      }),
      items: Joi.array()
        .items(
          Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .label('ID товара')
            .messages({
              'string.pattern.base':
                'ID товара имеет неверный формат (ожидается 24 символа hex)',
            }),
        )
        .min(1)
        .required()
        .label('Товары')
        .messages({
          'array.min': 'Должен быть хотя бы один товар в заказе',
          'array.base': 'Товары должны быть переданы в виде массива',
        }),
    }),
  },
  {
    abortEarly: false,
    messages: {
      'any.required': 'Поле {#label} обязательно для заполнения',
      'string.base': 'Поле {#label} должно быть строкой',
      'number.base': 'Поле {#label} должно быть числом',
      'array.base': 'Поле {#label} должно быть массивом',
    },
  },
)
