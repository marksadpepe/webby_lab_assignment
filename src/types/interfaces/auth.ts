interface GenericUserDataPayload {
  email: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegistrationPayload extends GenericUserDataPayload {}

export interface RegistrationResponse {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoginPayload extends GenericUserDataPayload {}

export interface LoginResponse {
  token: string;
}

export interface LogoutReponse {
  success: boolean;
}
