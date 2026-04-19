import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diploma-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#2563EB]/20">
      <!-- Background Image -->
      <img [src]="image" [alt]="title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
      
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      
      <!-- Content -->
      <div class="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 class="text-white font-bold text-xl mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 tracking-tight">{{ title }}</h3>
        <p class="text-gray-300 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 line-clamp-3 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DiplomaCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() image: string = '';
}
