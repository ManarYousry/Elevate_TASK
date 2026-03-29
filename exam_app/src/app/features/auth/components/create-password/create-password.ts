import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { passwordNewMatchValidator, strongPasswordValidator } from '../../validators/validators';
import { AppButtonConfig, Button } from "../../../../shared/components/button/button";
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordResponse } from '../../interfaces/Auth';

@Component({
  selector: 'app-create-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    Button
],
    standalone:true,
  templateUrl: './create-password.html',
  styleUrl: './create-password.css',
  providers:[MessageService]
})
export class CreatePassword {
  token!:string
  btnConfig: AppButtonConfig={
     label: 'Reset Password',
    type:"submit",
    styleClass:"bg-cyan-500 w-full text-white",


  }
resetForm!: FormGroup;
  isLoading = false;
 private router= inject(Router)
 private fb= inject(FormBuilder)
 private route=inject(ActivatedRoute)
private _authService=inject(AuthService)
private messageService=inject(MessageService)
  ngOnInit(): void {

     this.route.queryParams.subscribe(params => {
    this.token = params['token'];

  });
    this.resetForm = this.fb.group(
      {
        token:[this.token , [Validators.required]],
        newPassword:     ['', [Validators.required,strongPasswordValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordNewMatchValidator }
    );
  }

  isInvalid(field: string): boolean {
    const control = this.resetForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;


     this._authService.resetPassword(this.resetForm.value).subscribe({
      next: (res: ResetPasswordResponse) => {
       if(res.status){
         this.isLoading = false
this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message});

   this.router.navigate(['/login']);
       }
       },
      error: (error:any)  => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'An error occurred during password reset. Please try again later.' });
       },
    });
  }
}
