export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'HttpException';
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class ValidationException extends BadRequestException {
  constructor(
    message = 'Validation failed',
    public readonly details?: any[]
  ) {
    super(message);
    this.name = 'ValidationException';
  }
}
