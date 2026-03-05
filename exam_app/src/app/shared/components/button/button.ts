import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
export interface AppButtonConfig {
  label: string;
  type?: 'button' | 'submit';
  styleClass?: string ;
  icon?: string;
  iconDirection?:string
}
@Component({
  selector: 'app-button',
  standalone:true,
  imports: [ButtonModule,CommonModule],
 template:`<button  pButton [type]="config?.type || 'button'"

  [ngClass]="config?.styleClass"
  [disabled]="disabled || loading"
   (click)="onClick()" >
   @if(config?.icon && config?.iconDirection=="left"){
   <i  [class]="config.icon"></i>
   }
@if(!loading){
  <span >
    {{ config?.label }}
  </span>
}

 @if(config?.icon && config?.iconDirection=="right"){
   <i  [class]="config.icon"></i>
   }
@if(loading){
  <span >
    Loading...
  </span>
  }
 </button>`,
  styles: ``,
})
export class Button {

 @Input({ required: true }) config!: AppButtonConfig;
  @Input() loading = false;
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }




}
