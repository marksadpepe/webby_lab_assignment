import { UserModel } from "../models/user.model";
import { ApiException } from "../exceptions/api-exception";
import * as bcrypt from "bcrypt";
import { config } from "../config/config";
import { redis } from "./redis.service";
import { randomUUID } from "crypto";
import { LoginPayload, LoginResponse, LogoutReponse, RegistrationPayload, RegistrationResponse } from "../types/interfaces/auth";
import { GenericResponse } from "../types/interfaces/generic";

class AuthService {
  async register(payload: RegistrationPayload): Promise<GenericResponse<RegistrationResponse>> {
    const {email, password} = payload

    const existing = await UserModel.findOne({ where: { email } })
    if (existing) {
      throw ApiException.ConflictException("User with this email already exists")
    }

    const { hashSalt } = config

    const hashedPassword = await bcrypt.hash(password, hashSalt)

    const user = await UserModel.create({ email, password: hashedPassword })

    return { data: {id: user.id}}
  }

  async login(payload: LoginPayload): Promise<GenericResponse<LoginResponse>> {
    const {email, password} = payload

    const user = await UserModel.findOne({ where: { email } })

    if (!user) {
      throw ApiException.NotFoundException("User not found")
    }

    const { redis: {ttl} } = config

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      throw ApiException.BadRequestException("Invalid password")
    }

    const token = randomUUID()
    
    await redis.set(`session:${token}`, user.id, "EX", ttl)
    
    return { data: {token} }
  }

  async logout(token: string): Promise<GenericResponse<LogoutReponse>> {
    await redis.del(`session:${token}`)

    return { data: {success: true }}
  }
}

export const authService = new AuthService()


