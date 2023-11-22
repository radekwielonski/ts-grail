export class HttpError extends Error {
  public status: number;
  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}
