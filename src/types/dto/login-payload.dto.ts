import { LoginPayload } from '../interfaces/auth';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginPayloadDto implements LoginPayload {
  @IsEmail({}, { message: 'user email must be a string' })
  email: string;

  @IsString({ message: 'user password must be a string' })
  @IsNotEmpty({ message: 'user password must not be empty' })
  @MinLength(8, { message: 'password must contain at least 8 characters' })
  password: string;
}
