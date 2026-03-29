
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const passwordNewMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password        = group.get('newPassword');
  const confirmPassword = group.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    // Set error ON the control — not on the group
    confirmPassword.setErrors({ passwordMismatch: true });
  } else {
    // ✅ Clear ONLY passwordMismatch, preserve any other existing errors
    const errors = { ...confirmPassword.errors };
    delete errors['passwordMismatch'];
    confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
  }

  // Always return null from the group — error lives on the control now
  return null;
};


export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password        = group.get('password');
  const confirmPassword = group.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    // Set error ON the control — not on the group
    confirmPassword.setErrors({ passwordMismatch: true });
  } else {
    // ✅ Clear ONLY passwordMismatch, preserve any other existing errors
    const errors = { ...confirmPassword.errors };
    delete errors['passwordMismatch'];
    confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
  }

  // Always return null from the group — error lives on the control now
  return null;
};


export const strongPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value: string = control.value ?? '';
  const errors: ValidationErrors = {};

  if (value.length < 8)            errors['minlength']    = 'At least 8 characters';
  if (!/[A-Z]/.test(value))        errors['noUppercase']  = 'At least one uppercase letter';
  if (!/[0-9]/.test(value))        errors['noNumber']     = 'At least one number';

  return Object.keys(errors).length ? errors : null;
};
