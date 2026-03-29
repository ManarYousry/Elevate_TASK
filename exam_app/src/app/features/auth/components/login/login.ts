import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AppButtonConfig, Button } from "../../../../shared/components/button/button";
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { LoginResponse } from '../../interfaces/Auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    PasswordModule,
    MessageModule, Button],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers:[MessageService]
})
export class Login {
  private fb=inject(FormBuilder)
    private _authService=inject(AuthService)
    private messageService=inject(MessageService)
form!:FormGroup;
loginConfig: AppButtonConfig={
   label: 'Login',
  type:"submit",
  styleClass:"bg-cyan-500 w-full text-white"

}

  showError = false;
  loginError = '';
  isLoading = signal(false);
ngOnInit(){
  this.form = this.fb.group(
      {
        username:       ['', [Validators.required]],
        password:        ['', [Validators.required]],

      }
    );
}

 isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
  onLogin() {
    this.showError = true;
    this.loginError = '';

    if (!this.form.value.username || !this.form.value.password) return;

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);
this._authService.login(this.form.value).subscribe({
  next:(response:LoginResponse)=>{

 this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully logged in.' });
//  localStorage.setItem('token', response.token);
  },
  error:(error)=>{

      this.loginError = error.error?.message || 'An error occurred during login. Please try again later.';
  }
})
    }, 1500);
  }



}
