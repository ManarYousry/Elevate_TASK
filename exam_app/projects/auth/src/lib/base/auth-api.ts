import { Observable } from "rxjs";
import { ConfirmEmailVerRequest, ConfirmEmailVerResponse, ForgetPasswordRequest, ForgetPasswordResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ResetPasswordRequest, ResetPasswordResponse, SendEmailVerRequest, SendEmailVerResponse } from "../interfaces/Auth";

export abstract class AuthApi {
abstract login(data:LoginRequest):Observable<LoginResponse>;
abstract register(data:RegisterRequest):Observable<RegisterResponse>;
abstract forgetPassword(data:ForgetPasswordRequest):Observable<ForgetPasswordResponse>;
abstract resetPassword(data:ResetPasswordRequest):Observable<ResetPasswordResponse>;
abstract sendEmailVerification(data:SendEmailVerRequest):Observable<SendEmailVerResponse>;
abstract confirmEmailVerification(data:ConfirmEmailVerRequest):Observable<ConfirmEmailVerResponse>;
}
