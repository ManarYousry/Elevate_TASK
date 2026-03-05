import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { MessageModule } from 'primeng/message';
import { AppButtonConfig, Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    RouterLink,
    FormsModule,
    InputTextModule,
    PasswordModule,
    MessageModule, Button],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

loginConfig: AppButtonConfig={
   label: 'Login',
  type:"submit",
  styleClass:"bg-cyan-500 w-full text-white"

}
  username = '';
  password = '';
  rememberMe = false;
  showError = false;
  loginError = '';
  isLoading = signal(false);

  onLogin() {
    this.showError = true;
    this.loginError = '';

    if (!this.username || !this.password) return;

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);

      if (this.username !== 'admin' || this.password !== 'admin') {
        this.loginError = 'Invalid username or password. Try admin / admin';
      } else {
        alert('Login successful');
      }
    }, 1500);
  }



}
