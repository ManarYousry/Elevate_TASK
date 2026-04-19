import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex items-center gap-2 mb-4">
      <ng-container *ngFor="let item of items; let last = last">
        <a *ngIf="item.url && !last" [routerLink]="item.url" class="text-gray-400 hover:text-[#2563EB] text-sm transition-colors font-medium">
          {{ item.label }}
        </a>
        <span *ngIf="!item.url || last" class="text-[#2563EB] text-sm font-bold">
          {{ item.label }}
        </span>
        <i *ngIf="!last" class="pi pi-chevron-right text-[10px] text-gray-300"></i>
      </ng-container>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
