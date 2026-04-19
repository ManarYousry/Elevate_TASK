import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { LoginResponse } from '../interfaces/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthAdaptorService implements Adaptor {

// This method is responsible for adapting the response from the BE API  into a suitable format it called "Blue print".
  adapt(data: LoginResponse):any {
    return {
status:data?.status,
      token: data?.payload?.token,
      user: data?.payload?.user,

    };
  }

}
