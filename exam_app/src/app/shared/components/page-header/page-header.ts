import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="flex items-stretch gap-1 mb-8">
    <button *ngIf="url" [routerLink]="url" 
            class="w-12 cursor-pointer rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 transition-all hover:bg-gray-50 hover:text-[#2563EB] hover:border-[#2563EB]/20 hover:shadow-lg hover:shadow-[#2563EB]/10 active:scale-95 group">
      <i class="pi pi-angle-left text-xl transition-transform group-hover:-translate-x-1"></i>
    </button>

    <div class="flex-1 bg-[#2563EB] rounded-2xl p-6 flex items-center gap-4 shadow-xl shadow-[#2563EB]/20">
      <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
        <i [class]="icon" class="text-white text-2xl"></i>
      </div>
      <div>
        <h2 class="text-white font-bold text-2xl tracking-tight">{{ title }}</h2>
      </div>
    </div>
  </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() url!: string;

  @Input() icon: string = 'pi pi-folder';
}
