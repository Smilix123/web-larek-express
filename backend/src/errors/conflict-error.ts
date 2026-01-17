class ConflictError extends Error {
  statusCode = 409

  constructor(message = 'Конфликт данных') {
    super(message)
  }
}

export default ConflictError
