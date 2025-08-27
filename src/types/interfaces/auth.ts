
interface GenericUserDataPayload {
    email: string
    password: string
}

export interface RegistrationPayload extends GenericUserDataPayload {
}

export interface RegistrationResponse {
    id: string
}

export interface LoginPayload extends GenericUserDataPayload {
}

export interface LoginResponse {
    token: string
}

export interface LogoutReponse {
    success: boolean
}