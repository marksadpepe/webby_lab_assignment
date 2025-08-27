export class ApiException extends Error {
  status: number;
  errors;

  constructor(status: number, message: string, errors = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static BadRequestException(message: string, errors = []) {
    return new ApiException(400, message, errors)
  }

  static NotFoundException(message: string, errors = []) {
    return new ApiException(404, message, errors)
  }

  static ConflictException(message: string, errors = []) {
    return new ApiException(409, message, errors);
  }
}
