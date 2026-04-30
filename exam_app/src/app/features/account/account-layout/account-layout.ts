import { Component, inject } from '@angular/core';
import { ConfigureService } from '../../../core/services/configure';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { NavigationEnd, Router,RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-account-layout',
  imports: [CommonModule, RouterModule, BreadcrumbComponent, PageHeaderComponent],
  templateUrl: './account-layout.html',
  styleUrl: './account-layout.css',
})
export class AccountLayout {
  authSer = inject(ConfigureService)

  sidebarLinks = [
    { label: 'Profile', icon: 'pi pi-user', route: '/account/profile' },
    { label: 'Change Password', icon: 'pi pi-lock', route: '/account/change-password' }
  ];
  breadcrumbItems: BreadcrumbItem[] = [];


  constructor(private router: Router) {
   

  }
  ngOnInit(){
        this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb(this.router.url);
      });

    // initial call
    this.updateBreadcrumb(this.router.url);

  }
  updateBreadcrumb(url: string) {
    this.breadcrumbItems = [];

    if (url === '/account/change-password') {
      this.breadcrumbItems = [
        { label: 'Profile', url: '/account/profile' },
        { label: 'Change Password', url: '/account/change-password' }
      ];
    } else if (url === '/account/profile') {
      this.breadcrumbItems = [
        { label: 'Profile', url: '/account/profile' }
      ];
    }
  }
  logout() {
    this.authSer.Logout();
  }
}
