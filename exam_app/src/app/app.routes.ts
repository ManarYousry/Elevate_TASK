import { Routes } from '@angular/router';
import { auth_routes } from './features/auth/auth.routes';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ExamsListComponent } from './features/exams/exams-list';

import { ExamComponent } from './features/quiz/exam';
import { account_routes } from './features/account/account.routes';
import { AccountLayout } from './features/account/account-layout/account-layout';

export const routes: Routes = [
 ...auth_routes,
 {
   path: '',
   component: MainLayoutComponent,
   children: [
     { path: 'dashboard', component: DashboardComponent },
     { path: 'exams/:id', component: ExamsListComponent },
     { path: 'quiz/:id', component: ExamComponent },
     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
     ...account_routes
  //   {
  //   path: 'account',
   
  //   component: AccountLayout,
  //   children:account_routes
  // }
   ]
 },
  {
    path: '**',
    redirectTo: 'login'
  }
];
