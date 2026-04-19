import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConfigureService {
   constructor(private router: Router) { }


   setInLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
   }

  UserName() {
    return localStorage.getItem('username');
  }
  UserEmail() {
    return localStorage.getItem('email')
  }
 
  UserId() {
    return localStorage.getItem('userId')
  }
  UserToken() {
    return localStorage.getItem("token");
  }

  


  Logout() {

    localStorage.clear();
   
    this.router.navigate(['/login'], { replaceUrl: true });
    
  }

  
}
