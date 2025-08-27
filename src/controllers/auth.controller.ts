import { Request, Response, NextFunction } from 'express';
import { authService as AuthService } from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;

      const data = await AuthService.register(body);

      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;

      const data = await AuthService.login(body);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization || '';
      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || !token) {
        return res.status(200).json({ success: true });
      }

      const data = await AuthService.logout(token);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
