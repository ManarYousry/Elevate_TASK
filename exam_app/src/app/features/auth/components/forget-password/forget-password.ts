import { Component, inject, signal } from '@angular/core';
import { AppButtonConfig, Button } from '../../../../shared/components/button/button';
import { CommonModule } from '@angular/common';
import {RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StoreData } from '../../services/store-data';
import { AuthService ,ForgetPasswordResponse   } from '../../../../../../dist/auth';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule,
    RouterLink,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule, Button],
    standalone:true,
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
storeData=inject(StoreData)
private _authService=inject(AuthService)
showResetEmailMsg:boolean=false
btnConfig: AppButtonConfig={
   label: 'Continue',
  type:"submit",
  styleClass:"bg-cyan-500 w-full text-white",
  icon:"pi pi-arrow-right",
  iconDirection:"right"

}
  email =this.storeData.email() ||"";
  loginError = '';
  isLoading = signal(false);

  onSubmit() {

    this.loginError = '';

    if (!this.email ) return;

    this.isLoading.set(true);
    this.storeData.updateEmail(this.email)



    this._authService.forgetPassword({ email:this.email }).subscribe({
      next: (res:ForgetPasswordResponse) => {
        this.showResetEmailMsg=true;
         this.email= ""
       this.email=this.storeData.email()
        this.isLoading.set(false);},
      error: (error:any)  => {
        this.loginError = error.error?.message || 'An error occurred. Please try again later.';
          this.isLoading.set(false);

      },
    });




  }

goBack(){
this.showResetEmailMsg=false
}

}
