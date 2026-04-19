import { inject, Injectable } from '@angular/core';
import { APIs } from '../shared/Enum/helper';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthApi } from '../base/auth-api';
import { AuthAdaptorService } from '../adaptor/auth-adaptor-services';
import {  ConfirmEmailVerRequest, ConfirmEmailVerResponse, ForgetPasswordRequest, ForgetPasswordResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ResetPasswordRequest, ResetPasswordResponse, SendEmailVerRequest, SendEmailVerResponse } from '../interfaces/Auth';
import { AUTH_CONFIG } from '../interfaces/auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthApi {

  private readonly _config = inject(AUTH_CONFIG);
  private readonly _Api=APIs.Auth
  private readonly _baseUrl=this._config.apiUrl
  private readonly _httpClient=inject(HttpClient)
  private readonly _authAdaptor=inject(AuthAdaptorService)

  login(data:LoginRequest):Observable<LoginResponse | any>{
    return this._httpClient.post<LoginResponse>(this._baseUrl+this._Api.login,data)
    .pipe
    (map((response:LoginResponse)=>this._authAdaptor.adapt(response)),
    catchError((error)=>of(error)))
  }

  register(data:RegisterRequest):Observable<RegisterResponse>{
    return this._httpClient.post<RegisterResponse>(this._baseUrl+this._Api.register,data)
  }
  forgetPassword(data: ForgetPasswordRequest): Observable<ForgetPasswordResponse> {
 return this._httpClient.post<ForgetPasswordResponse>(this._baseUrl+this._Api.forgotPassword,data)
  }

  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this._httpClient.post<ResetPasswordResponse>(this._baseUrl+this._Api.resetPassword,data)
  }
   confirmEmailVerification(data: ConfirmEmailVerRequest): Observable<ConfirmEmailVerResponse> {
    return this._httpClient.post<ConfirmEmailVerResponse>(this._baseUrl+this._Api.confirmEmailVerification,data)
  }
   sendEmailVerification(data: SendEmailVerRequest): Observable<SendEmailVerResponse> {
    return this._httpClient.post<SendEmailVerResponse>(this._baseUrl+this._Api.sendEmailVerification,data)
  }

}
