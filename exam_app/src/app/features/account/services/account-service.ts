import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { APIs } from '../../../shared/Enum/helper';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { changeEmailResponse, changePasswordModel, confirmEmailChangeResponse, User, UserProfile, UserResponse, UserUpdate } from '../models/userDto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

    
  private readonly _config = environment;
  private readonly _Api=APIs.Account
  private readonly _baseUrl=this._config.apiUrl
  private readonly _httpClient=inject(HttpClient)
 

 

  getUserProfile():Observable<User>{
    
   
    return this._httpClient.get<UserResponse>(`${this._baseUrl}${this._Api.userProfile}`).pipe(
      map(res => res.payload.user)
    );

  }
    updateUserProfile(model:UserUpdate):Observable<User>{
   
    return this._httpClient.patch<UserResponse>(`${this._baseUrl}${this._Api.userProfile}`,model).pipe(
      map(res => res.payload.user)
    );

  }
    
  changeEmailRequest(newEmail:string):Observable<changeEmailResponse>{
   
    return this._httpClient.post<changeEmailResponse>(`${this._baseUrl}${this._Api.changeEmailRequest}`,{newEmail})
  }

   confirmEmailChange(code:string):Observable<confirmEmailChangeResponse>{
   
    return this._httpClient.post<confirmEmailChangeResponse>(`${this._baseUrl}${this._Api.confirmEmailChange}`,{code})
  }
  
   changePassword(model:changePasswordModel):Observable<changeEmailResponse>{
   
    return this._httpClient.post<changeEmailResponse>(`${this._baseUrl}${this._Api.changePassword}`,model)
  }

  deleteAccount():Observable<{message:string}>{
   
    return this._httpClient.delete<{message:string}>(`${this._baseUrl}${this._Api.deleteAccount}`)
  }
}
