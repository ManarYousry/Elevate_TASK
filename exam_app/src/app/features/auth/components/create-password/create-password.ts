import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { passwordMatchValidator } from '../../validators/validators';
import { AppButtonConfig, Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-create-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PasswordModule,
    ButtonModule,
    Button
],
    standalone:true,
  templateUrl: './create-password.html',
  styleUrl: './create-password.css',
})
export class CreatePassword {
  btnConfig: AppButtonConfig={
     label: 'Reset Password',
    type:"submit",
    styleClass:"bg-cyan-500 w-full text-white",


  }
resetForm!: FormGroup;
  isLoading = false;
 private router= inject(Router)
 private fb= inject(FormBuilder)
  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password:     ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
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

    setTimeout(() => {this.isLoading = false
      this.router.navigate(["/login"])
    }, 1500);
  }
}
