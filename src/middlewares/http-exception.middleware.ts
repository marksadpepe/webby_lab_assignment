import { ApiException } from '../exceptions/api-exception';

import { Request, Response, NextFunction } from 'express';

export function httpErrorMiddleware(
  err: ApiException | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (err instanceof ApiException) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  return res
    .status(500)
    .json({ message: 'Internal Server Error', errors: [err.message] });
}
