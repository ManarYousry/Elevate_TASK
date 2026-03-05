import { Component, ElementRef, inject, QueryList, Signal, signal, ViewChildren } from '@angular/core';
import { AppButtonConfig, Button } from '../../../../shared/components/button/button';
import { CommonModule } from '@angular/common';
import {Router, RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StoreData } from '../../services/store-data';

@Component({
  selector: 'app-verify-otp',
 imports: [CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule, Button],
    standalone:true,
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOTP {
  router=inject(Router)
 public storeData=inject(StoreData)
btnConfig: AppButtonConfig={
   label: 'Verify Code',
  type:"submit",
  styleClass:"bg-cyan-500 w-full text-white",

}

 @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpLength = 6;
  otpControls: FormControl[] = [];
  otpForm!: FormGroup;


  isLoading = false;
  resendCooldown = 0;
  private cooldownTimer: any;

  ngOnInit(): void {
    debugger
   let email = this.storeData.email()
    // Build 6 individual FormControls
    this.otpControls = Array.from({ length: this.otpLength }, () =>
      new FormControl('', [Validators.required, Validators.pattern(/^\d$/)])
    );

    // Group them so we can track overall validity
    const group: Record<string, FormControl> = {};
    this.otpControls.forEach((ctrl, i) => (group[`d${i}`] = ctrl));
    this.otpForm = new FormGroup(group);
  }

  // Auto-focus next box on input
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.otpControls[index].setValue(value ? value[0] : '');
    if (value && index < this.otpLength - 1) {
      this.focusBox(index + 1);
    }
  }

  // Backspace goes to previous box
  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpControls[index].value && index > 0) {
      this.focusBox(index - 1);
    }
  }

  // Paste fills all boxes
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    pasted.split('').slice(0, this.otpLength).forEach((char, i) => {
      this.otpControls[i].setValue(char);
    });
    this.focusBox(Math.min(pasted.length, this.otpLength - 1));
  }

  private focusBox(index: number): void {
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      inputs[index]?.nativeElement.focus();
    });
  }

  get otpValue(): string {
    return this.otpControls.map(c => c.value).join('');
  }

  onVerify(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    setTimeout(() =>{
      this.isLoading = false ;
       this.router.navigate(['/create-password'])
      }, 1500);
  }

  resendCode(): void {
    if (this.resendCooldown > 0) return;
    this.resendCooldown = 60;

    this.cooldownTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) clearInterval(this.cooldownTimer);
    }, 1000);
  }

  editEmail(): void {
    this.router.navigate(['/register']);
  }

  goBack(): void {
    this.router.navigate(['/register']);
  }

  ngOnDestroy(): void {
    clearInterval(this.cooldownTimer);
  }

}
