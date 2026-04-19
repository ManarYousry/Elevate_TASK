import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import intlTelInput from 'intl-tel-input';
import { AppButtonConfig, Button } from "../../../../shared/components/button/button";
import { passwordMatchValidator, strongPasswordValidator } from '../../validators/validators';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { OtpInputDirective } from '../../directives/otp-input.directive';
 import { AuthService ,ConfirmEmailVerResponse, RegisterResponse, SendEmailVerResponse ,StoreData   } from '../../../../../../dist/auth';
import { MessageService } from 'primeng/api';

import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

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
    InputGroupAddonModule,MessageModule,
    ToastModule ,
     Button,OtpInputDirective],
    standalone:true,
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers:[MessageService]
})
export class Register {
  private messageService=inject(MessageService)
  private fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private storeData=inject(StoreData)
  private router=inject(Router)

  loginConfig: AppButtonConfig = {
    label: 'Create Account',
    type: 'submit',
    styleClass: 'bg-blue-600 w-full text-white hover:bg-blue-700',
  };

  registerForm!: FormGroup;
  isLoading = false;

  @ViewChild('phoneInput') phoneInputRef!: ElementRef;
  private iti: any;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  isOtpComplete = false;
  private otpValue = '';
  currentStep = 1;
  totalSteps  = 4;
  otpTimeLeft = 600;
  private otpTimer: any;
private savedPhone = '';

  get otpTimeFormatted(): string {
    const m = Math.floor(this.otpTimeLeft / 60).toString().padStart(2, '0');
    const s = (this.otpTimeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName:       ['', [Validators.required]],
        lastName:        ['', [Validators.required]],
        username:        ['', [Validators.required, Validators.minLength(3)]],
        email:           [this.storeData.email() ||'', [Validators.required, Validators.email]],
        phone:    ['', [Validators.required]], //, Validators.pattern(/^\d{7,15}$/)
        password:        ['', [Validators.required, strongPasswordValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }




  getFullPhone(): string {
    return this.iti?.getNumber() ?? '';
  }

  /** Called when navigating to step 3 to init phone input */
  initPhoneInput(): void {
    if (this.phoneInputRef && !this.iti) {
      this.iti = intlTelInput(this.phoneInputRef.nativeElement, {
        initialCountry: 'eg',
        countryOrder: ['sa', 'eg', 'ae', 'us', 'gb'],
        separateDialCode: true,
        loadUtils: () => import('intl-tel-input/utils'),
      });
    }
  }



  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }


  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
        const firstInvalidControl = Object.keys(this.registerForm.controls)
    .find(controlName => this.registerForm.get(controlName)?.invalid);

       console.log('First invalid:', firstInvalidControl);
      return;
    }

    const phone = this.savedPhone;
    if (!phone) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Phone number is missing. Please go back and re-enter it.',
      });
      return;
    }
    this.isLoading = true;

this._authService.register(this.registerForm.value).subscribe({
    next: (res:RegisterResponse) => {

      this.isLoading = false;
      if (res.status) {
        this.messageService.add({
          severity: 'success',
          summary: 'Account Created',
          detail: 'Your account was created successfully!',
        });
        this.router.navigate(['/login']);
      }
    },

    error: (error: any) => {
      this.isLoading = false;
      const body = error?.error;

      // ── Case 1: errors array  e.g. [{path:'password', message:'...'}] ──
      if (body?.errors?.length) {
        // Show each validation error as a separate toast
        body.errors.forEach((err: { path: string; message: string }) => {
          this.messageService.add({
            severity: 'error',
            summary: `${err.path.charAt(0).toUpperCase() + err.path.slice(1)} error`,
            detail: err.message,
            life: 6000,
          });
        });

        // Also mark the matching form controls as invalid so the user
        // can see which field is broken even if they're on a previous step
        body.errors.forEach((err: { path: string; message: string }) => {
          const control = this.registerForm.get(err.path);
          if (control) {
            control.setErrors({ serverError: err.message });
            control.markAsTouched();
          }
        });

        return;
      }

      // ── Case 2: single message string ────────────────────────────────────
      this.messageService.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: body?.message || 'An error occurred. Please try again.',
        life: 6000,
      });
    },
  });
  }
ngOnDestroy(): void {
    this.clearOtpTimer();
  }
  // ── Stepper ───────────────────────────────────────────────────────────────
  nextStep(): void {
    if (this.currentStep === 1) {

      const email = this.registerForm.get('email');
      this.storeData.updateEmail(email?.value || '')

      this.registerForm.get('email')?.setValue(this.storeData.email());
      email?.markAsTouched();
      if (email?.invalid) return;
    }

    if (this.currentStep === 3) {
      ['firstName', 'lastName', 'username', 'phone'].forEach(f =>
        this.registerForm.get(f)?.markAsTouched()
      );
      const hasError = ['firstName', 'lastName', 'username', 'phone'].some(
        f => this.registerForm.get(f)?.invalid
      );
      if (hasError) return;

     this.savedPhone = this.iti?.getNumber() ?? this.registerForm.get('phone')!.value;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      if (this.currentStep === 2) this.startOtpTimer();
      if (this.currentStep === 3) setTimeout(() => this.initPhoneInput(), 0);
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      if (this.currentStep === 2) {
        this.clearOtpTimer();
        this.resetOtpInputs();
      }
      this.currentStep--;
    }
  }

  // ── OTP Timer ─────────────────────────────────────────────────────────────
  private startOtpTimer(): void {
    this.clearOtpTimer();
    this.otpTimeLeft = 600;
    this.otpTimer = setInterval(() => {
      if (this.otpTimeLeft > 0) this.otpTimeLeft--;
      else this.clearOtpTimer();
    }, 1000);
  }

  private clearOtpTimer(): void {
    if (this.otpTimer) { clearInterval(this.otpTimer); this.otpTimer = null; }
  }

  resendOtp(): void {
    this.resetOtpInputs();
    this.startOtpTimer();
     this.verifyOtp();
  }


  onOtpChange(): void {
    const inputs = Array.from(this.otpInputs ?? []) as ElementRef[];
    const value  = inputs.map(i => i.nativeElement.value).join('');
    this.isOtpComplete = /^\d{6}$/.test(value);
    if (this.isOtpComplete) this.otpValue = value;
  }

  onOtpComplete(otp: string): void {
    this.otpValue      = otp;
    this.isOtpComplete = true;
  }

  private resetOtpInputs(): void {
    (Array.from(this.otpInputs ?? []) as ElementRef[]).forEach(
      i => (i.nativeElement.value = '')
    );
    this.isOtpComplete = false;
    this.otpValue      = '';
  }

  verifyOtp(): void {

    if (!this.isOtpComplete || this.otpTimeLeft === 0) return;

    const email = this.registerForm.get('email')!.value;
    const code   = this.otpValue; // full concatenated 6-digit string
    this._authService.confirmEmailVerification({ email, code: code }).subscribe({
      next: (res: ConfirmEmailVerResponse) => {

         if(res.status){

    this.clearOtpTimer(); this.nextStep();
           this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message || 'Verification code sent successfully.' });


                  }
          else{
             this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message || 'Failed to send verification code. Please try again.' });

                }

         },
      error: ()  => { this.resetOtpInputs(); },
    });

    this.clearOtpTimer();

  }

  sendEmailVerification(){

 if (this.currentStep === 1) {

      const email = this.registerForm.get('email');
      this.storeData.updateEmail(email?.value || '')

      this.registerForm.get('email')?.setValue(this.storeData.email());
      email?.markAsTouched();
      if (email?.invalid) return;
    }
    const email = this.registerForm.get('email')!.value;

    this._authService.sendEmailVerification({ email }).subscribe({
      next: (res: SendEmailVerResponse) => {


         if(res.status){

          this.nextStep();
           this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message || 'Verification code sent successfully.' });
          }
          else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message || 'Failed to send verification code. Please try again.' });
         } },
      error: (error)  => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'An error occurred. Please try again later.' });
       },
    });


  }
}
