import { Component, ElementRef, inject, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import intlTelInput from 'intl-tel-input';
import { AppButtonConfig, Button } from "../../../../shared/components/button/button";
import { passwordMatchValidator } from '../../validators/validators';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-register',
  imports: [  CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule, Button],
    standalone:true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
 private fb= inject(FormBuilder)
loginConfig: AppButtonConfig={
   label: 'Create Account',
  type:"submit",
  styleClass:"bg-cyan-500 w-full text-white"

}
 registerForm!: FormGroup;
  isLoading = false;
  @ViewChild('phoneInput') phoneInputRef!: ElementRef;
  private iti: any;




  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName:       ['', [Validators.required]],
        lastName:        ['', [Validators.required]],
        username:        ['', [Validators.required, Validators.minLength(3)]],
        email:           ['', [Validators.required, Validators.email]],

        phone_number:           ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
        password:        ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

ngAfterViewInit(): void {
    this.iti = intlTelInput(this.phoneInputRef.nativeElement, {

     initialCountry: 'eg',
    countryOrder: ['sa', 'eg', 'ae', 'us', 'gb'],
    separateDialCode: true,
    loadUtils: () => import('intl-tel-input/utils'),
    });
  }

  getFullPhone(): string {
    return this.iti?.getNumber() ?? '';
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (!this.iti?.isValidNumber()) {
      console.error('Invalid phone number');
      return;
    }
    this.isLoading = true;


    setTimeout(() => (this.isLoading = false), 1500);
  }



}
