
export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
 
   status?:string
   payload?:{
    user?: User;
    token?: string;
   }
}

export interface RegisterRequest {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
export interface RegisterResponse {
  status?:string
  user?: User;
  token?: string;
}

export interface ForgetPasswordRequest {
  email?: string;
}

export interface ForgetPasswordResponse {
  message?: string;
  resetToken?: string;
   status?:string
}

export interface ResetPasswordRequest {
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ResetPasswordResponse {
  message?: string;
   status?:string
}

export interface ConfirmEmailVerRequest {
  email?: string;
  code?: string;
}

export interface ConfirmEmailVerResponse {
  message?: string;
   status?:string
}

export interface SendEmailVerRequest {
  email?: string;
}

export interface SendEmailVerResponse {
  status?:string
  message?: string;
  code?: string;
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}
