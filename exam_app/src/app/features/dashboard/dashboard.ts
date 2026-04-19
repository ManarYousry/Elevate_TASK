import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { DiplomaCardComponent } from './diploma-card/diploma-card';
import { RouterModule } from '@angular/router';
import { DashboardService } from './services/dashboard_service';
import { DiplomaObj } from './models/diplomaDto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, DiplomaCardComponent, RouterModule],
  template: `
    <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
    <app-page-header title="Diplomas" icon="pi pi-graduation-cap"></app-page-header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
      <app-diploma-card *ngFor="let diploma of diplomas"
                       [title]="diploma.title"
                       [description]="diploma.description"
                       [image]="diploma.image"
                       [routerLink]="['/exams', diploma.id]">
      </app-diploma-card>
    </div>

    <!-- Infinite Scroll Anchor -->
    <div #scrollAnchor class="flex justify-center py-12" *ngIf="hasMore">
      <div class="flex items-center gap-3 text-[#2563EB]">
        <i class="pi pi-spin pi-spinner text-2xl"></i>
        <span class="font-bold tracking-tight">Loading more diplomas...</span>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  private $destroyRef= inject(DestroyRef)
  private dashboardService = inject(DashboardService);
  private observer!: IntersectionObserver;
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Diplomas' }
  ];

  diplomas: DiplomaObj[] = [];
  currentPage = 1;
  limit = 6;
  hasMore = true;
  isLoading = false;

  ngOnInit() {
    this.loadDiplomas();
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '100px', // Start loading before reaching the very bottom
      threshold: 0.1
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && this.hasMore && !this.isLoading) {
        this.loadMore();
      }
    }, options);

    if (this.scrollAnchor) {
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  loadDiplomas() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.dashboardService.getAllDiplomas({ page: this.currentPage, limit: this.limit }).pipe(takeUntilDestroyed(this.$destroyRef)).subscribe({
      next: (response:any) => {
        if (response.status) {
          this.diplomas = [...this.diplomas, ...response?.payload?.data];
          this.hasMore = this.currentPage < response?.payload?.metadata.totalPages;
        }
        this.isLoading = false;
        
        // Re-observe if we just added data and still have more
        setTimeout(() => {
          if (this.hasMore && this.scrollAnchor) {
            this.observer.unobserve(this.scrollAnchor.nativeElement);
            this.observer.observe(this.scrollAnchor.nativeElement);
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.currentPage++;
      this.loadDiplomas();
    }
  }
}


