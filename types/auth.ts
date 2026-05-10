export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string | null;
  role: "USER" | "ADMIN";
}

export interface AuthTokens {
  accessToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
