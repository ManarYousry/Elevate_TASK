import { Routes } from '@angular/router';
import { auth_routes } from './features/auth/auth.routes';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ExamsListComponent } from './features/exams/exams-list';

import { ExamComponent } from './features/quiz/exam';

export const routes: Routes = [
 ...auth_routes,
 {
   path: '',
   component: MainLayoutComponent,
   children: [
     { path: 'dashboard', component: DashboardComponent },
     { path: 'exams/:id', component: ExamsListComponent },
     { path: 'quiz/:id', component: ExamComponent },
     { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
   ]
 },
  {
    path: '**',
    redirectTo: 'login'
  }
];
