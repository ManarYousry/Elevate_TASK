import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreData {
  private _email = signal<string>(localStorage.getItem('email') || '');

  email = this._email.asReadonly();

  updateEmail(email: string) {
    this._email.set(email);
    localStorage.setItem('email', email);
  }
}
