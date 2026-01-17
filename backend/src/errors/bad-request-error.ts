class BadRequestError extends Error {
  statusCode = 400

  constructor(message = 'Некорректные данные') {
    super(message)
  }
}

export default BadRequestError
