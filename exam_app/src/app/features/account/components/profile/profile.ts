import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { OtpInputDirective } from '../../../auth/directives/otp-input.directive';
import { AppButtonConfig, Button } from '../../../../shared/components/button/button';
import { AccountService } from '../../services/account-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { changeEmailResponse, confirmEmailChangeResponse, User } from '../../models/userDto';
import intlTelInput from 'intl-tel-input';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule, MessageModule,
    ToastModule,
    FormsModule,
    DialogModule,
    Button, OtpInputDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [MessageService,ConfirmationService]
})
export class Profile {
  form!: FormGroup
  private messageService = inject(MessageService);
  public confirmationService= inject(ConfirmationService)
  private fb = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private router = inject(Router)
  username: string = ""
  email: string = ""
  @ViewChild('phoneInput') phoneInputRef!: ElementRef;
  private iti: any;
showEmailDialog = false;
newEmail: string = '';

  emailStep: 'email' | 'otp' = 'email';
  otpValue: string = '';
  isOtpComplete: boolean = false;
  timer: number = 60;
  interval: any;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  saveChangeConfig: AppButtonConfig = {
    label: 'Save Changes',
    type: 'submit',
    styleClass: 'bg-blue-500 w-full text-white hover:bg-blue-700',
  };
  deleteAccConfig: AppButtonConfig = {
    label: 'Delete My Account',
    type: 'button',
    styleClass: 'bg-red-100 w-full p-button-danger text-red-500 hover:bg-red-200',
  };

  emailChangeConfig: AppButtonConfig = {
    label: 'Next',
    type: 'button',
    icon:'pi pi-arrow-right',
    iconDirection:"right",
    styleClass: 'bg-blue-500 w-full text-white hover:bg-blue-700',
  };
  ngOnInit() {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
       
        phone: ['', [Validators.required]],

      }
    );

    this.initPhoneInput();
    this.getUserProfile();

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
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }


  getUserProfile() {
    debugger
    this._accountService.getUserProfile().subscribe({
      next: (res: User) => {
        debugger
        let data = res
        this.form.patchValue(data)
        this.username = data.username;
        this.email = data.email

      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },


    })
  }
  onSubmit() {
debugger
    if (this.form.invalid) {

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all the fields',
      });
      return;
    }


    this._accountService.updateUserProfile(this.form.value).subscribe({
      next: (res: User) => {
        debugger
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile Updated successfully',
        });
        this.form.patchValue(res)
        this.username = res.username;
        this.email = res.email

      },
      error: (err) => {
        debugger
         this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
        console.error('Error Updating profile:', err);
      },


    })
  }



  openDialog() {
    this.showEmailDialog = true;
    this.emailStep = 'email';
    this.newEmail = '';
    this.otpValue = '';
    this.isOtpComplete = false;
    clearInterval(this.interval);
  }

  closeDialog() {
    this.showEmailDialog = false;
    this.newEmail = '';
    this.otpValue = '';
    this.isOtpComplete = false;
    clearInterval(this.interval);
  }

  changeEmail() {
    if (!this.newEmail) return;
    this._accountService.changeEmailRequest(this.newEmail).subscribe({
      next: (res: changeEmailResponse) => {
        this.emailStep = 'otp';
        this.startTimer();
      },
      error: (err) => {
        console.error('Error requesting email change:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not request email change' });
      },
    })
  }

  onOtpComplete(value: string) {
    debugger
    this.otpValue = value;
    this.isOtpComplete = true;
  }

  onOtpChange() {
    if (this.otpInputs) {
      const currentOtp = this.otpInputs.map(i => i.nativeElement.value).join('');
      this.isOtpComplete = currentOtp.length === 6;
      if (this.isOtpComplete) {
        this.otpValue = currentOtp;
      }
    } else {
      this.isOtpComplete = false;
    }
  }

  startTimer() {
    this.timer = 60;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  verifyOtp() {
    if (!this.isOtpComplete) return;
    this._accountService.confirmEmailChange(this.otpValue).subscribe({
      next: (res: confirmEmailChangeResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Email changed successfully' });
        this.getUserProfile();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error verifying OTP:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid or expired OTP' });
      }
    })
  }

 deleteAccount() {
  
    this.confirmationService.confirm({
    key: 'deleteDialog'
  });
 
}

onConfirmDelete() {
  this._accountService.deleteAccount().subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account deleted successfully',
      });

      this.router.navigate(['/auth/login']);
      this.confirmationService.close();
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete account',
      });
      this.confirmationService.close();
    }
  });
}

}
