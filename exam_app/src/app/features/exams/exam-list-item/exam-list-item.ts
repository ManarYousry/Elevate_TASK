import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-list-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#2563EB]/5 hover:-translate-y-1">
      <div class="w-16 h-16 bg-[#F8F9FA] rounded-xl flex items-center justify-center p-1">
        <img [src]="icon" [alt]="title" class="w-full h-full object-contain">
      </div>
      <div class="flex-1">
        <h3 class="text-gray-800 font-bold text-lg mb-1 tracking-tight">{{ title }}</h3>
       
      </div>
      <div class="text-right flex gap-3">
       <p class="text-gray-600 text-xs font-medium">{{ questionsCount }} Questions</p>
       <span class="text-gray-600 text-xs font-medium"> | </span>
       
        <p class="text-gray-600 text-xs font-medium"> {{ duration }} Minutes</p>
      </div>
      <div class="ml-4">
        <button class="bg-[#2563EB] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#2563EB]/20 transition-all hover:bg-[#1d4ed8] hover:scale-105 active:scale-95">
          Start
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ExamListItemComponent {
  @Input() title: string = '';
  @Input() questionsCount: number = 0;
  @Input() duration: number = 0;
  @Input() icon: string = '';
  @Input() id: string = '';
}
