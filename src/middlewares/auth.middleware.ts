import { NextFunction, Request, Response } from 'express';
import { redis } from '../services/redis.service';
import { ApiException } from '../exceptions/api-exception';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw ApiException.UnauthorizedException('Unauthorized');
    }

    const userId = await redis.get(`session:${token}`);

    if (!userId) {
      throw ApiException.UnauthorizedException('Unauthorized');
    }

    (req as any).user = { id: userId };
    next();
  } catch (err) {
    next(err);
  }
}
