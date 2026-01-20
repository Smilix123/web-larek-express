class NotFoundError extends Error {
  statusCode = 404

  constructor(message = 'Запрашиваемый ресурс не найден') {
    super(message)
  }
}

export default NotFoundError
