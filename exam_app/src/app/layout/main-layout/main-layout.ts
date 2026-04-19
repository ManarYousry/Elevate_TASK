import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ConfigureService } from '../../core/services/configure';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {
  private configureSer = inject(ConfigureService)
  userName=this.configureSer.UserName();
    email=this.configureSer.UserEmail()
  sidebarLinks = [
    { label: 'Diplomas', icon: 'pi pi-th-large', route: '/dashboard' },
    { label: 'Account Settings', icon: 'pi pi-user', route: '/settings' }
  ];
}
