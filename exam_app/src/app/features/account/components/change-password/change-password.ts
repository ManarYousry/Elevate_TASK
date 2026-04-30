import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AppButtonConfig, Button } from '../../../../shared/components/button/button';
import { AccountService } from '../../services/account-service';
import { MessageService } from 'primeng/api';
import { passwordNewMatchValidator, strongPasswordValidator } from '../../../auth/validators/validators';
import { changeEmailResponse } from '../../models/userDto';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
  MessageModule,
    ToastModule,
    FormsModule,
    Button],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
   providers: [MessageService]
})
export class ChangePassword {
form!: FormGroup
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private _accountService = inject(AccountService);
 
  saveChangeConfig: AppButtonConfig = {
    label: 'Update Password',
    type: 'submit',
    styleClass: 'bg-blue-500 w-full text-white hover:bg-blue-700',
  };
  
  ngOnInit() {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required,strongPasswordValidator]],  
        confirmPassword: ['', [Validators.required]],

      },
      { validators: passwordNewMatchValidator }
    );

  

  }

 

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }


 
  onSubmit() {
debugger
    if (this.form.invalid) {

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid fields',
      });
      return;
    }


    this._accountService.changePassword(this.form.value).subscribe({
      next: (res: changeEmailResponse) => {
        debugger
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Passwored Changed successfully',
        });
       

      },
      error: (err) => {
        debugger
         this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
        console.error('Error change password:', err);
      },


    })
  }




 

 
  

}
