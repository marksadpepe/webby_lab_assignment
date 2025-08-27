import { RegistrationPayload } from '../interfaces/auth';
import { IsString, IsEmail } from 'class-validator';

export class RegistrationPayloadDto implements RegistrationPayload {
  @IsEmail({}, { message: 'user email must be a string' })
  email: string;

  @IsString({ message: 'user password must be a string' })
  password: string;
}
