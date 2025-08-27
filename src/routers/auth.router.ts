import { Router } from 'express';
import { authController as AuthController } from '../controllers/auth.controller';
import { requestDtoValidationMiddleware } from '../middlewares/request-dto-validation.middleware';
import { RegistrationPayloadDto } from '../types/dto/registration-payload.dto';
import { LoginPayloadDto } from '../types/dto/login-payload.dto';

const authRouter = Router();

authRouter.post(
  '/register',
  requestDtoValidationMiddleware(RegistrationPayloadDto, { isBody: true }),
  AuthController.register,
);
authRouter.post(
  '/login',
  requestDtoValidationMiddleware(LoginPayloadDto, { isBody: true }),
  AuthController.login,
);
authRouter.post('/logout', AuthController.logout);

export { authRouter };
