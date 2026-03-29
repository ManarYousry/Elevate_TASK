import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * Directive: appOtpInput
 * ─────────────────────
 * Attaches to each OTP <input> to handle:
 *  - Auto-advance to the next box after typing a digit
 *  - Backspace: clear current → focus previous
 *  - Paste: spread digits across all boxes
 *  - Emit (otpComplete) when all 6 boxes are filled
 *  - Emit (otpChange) on every keystroke (for button enable/disable)
 *
 * Usage in template:
 *   <input appOtpInput [otpIndex]="i" [otpInputs]="otpInputs"
 *          (otpComplete)="onOtpComplete($event)" (otpChange)="onOtpChange()" />
 *
 *  otpInputs  → QueryList<ElementRef> from @ViewChildren('otpInput')
 *  otpIndex   → zero-based position of this input (0-5)
 */
@Directive({
  selector: '[appOtpInput]',
  standalone: true,
})
export class OtpInputDirective {
  @Input() otpIndex!: number;
  @Input() otpInputs!: any; // QueryList<ElementRef>

  /** Fires with the full 6-char string when all boxes are filled */
  @Output() otpComplete = new EventEmitter<string>();

  /** Fires on every change so the parent can update isOtpComplete */
  @Output() otpChange = new EventEmitter<void>();

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // ── Keydown: handle backspace & non-digit keys ──────────────────────────
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const input = this.el.nativeElement;

    if (e.key === 'Backspace') {
      if (input.value) {
        input.value = '';
        this.otpChange.emit();
      } else {
        this.focusAt(this.otpIndex - 1);
      }
      e.preventDefault();
      return;
    }

    // Allow only single digit keys; block everything else except navigation
    if (!/^\d$/.test(e.key) && !['Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  }

  // ── Input: accept digit, advance focus, check completion ────────────────
  @HostListener('input', ['$event'])
  onInput(e: Event): void {
    const input = this.el.nativeElement;
    const digit = input.value.replace(/\D/g, '').slice(-1); // keep last digit
    input.value = digit;

    if (digit) {
      this.focusAt(this.otpIndex + 1);
      this.checkComplete();
    }

    this.otpChange.emit();
  }

  // ── Paste: spread digits across all boxes ───────────────────────────────
  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent): void {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    const inputs = this.getInputs();

    digits.forEach((d, idx) => {
      if (inputs[idx]) inputs[idx].nativeElement.value = d;
    });

    // Focus the next empty box or the last filled one
    const nextEmpty = digits.length < 6 ? digits.length : 5;
    this.focusAt(nextEmpty);
    this.checkComplete();
    this.otpChange.emit();
  }

  // ── Click: select so typing replaces existing value ─────────────────────
  @HostListener('click')
  onClick(): void {
    this.el.nativeElement.select();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  private focusAt(index: number): void {
    const inputs = this.getInputs();
    const target = inputs[index];
    if (target) target.nativeElement.focus();
  }

  private getInputs(): any[] {
    // otpInputs is QueryList<ElementRef> — convert to array
    return this.otpInputs ? Array.from(this.otpInputs) : [];
  }

  private checkComplete(): void {
    const inputs = this.getInputs();
    const value = inputs.map((i: any) => i.nativeElement.value).join('');
    if (value.length === 6) {
      this.otpComplete.emit(value);
    }
  }
}
