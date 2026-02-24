import { Routes } from '@angular/router';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'issue-list',
    pathMatch: 'full'
  },


   {
        path: 'issue-list',
        loadComponent: () => import('./Issue/issue-list/issue-list.component').then((m) => m.IssueListComponent)
      },
       {
        path: 'create-issue',
        loadComponent: () => import('./Issue/create-issue/create-issue.component').then((m) => m.CreateIssueComponent)
      },
       {
        path: 'issue/:id',
        loadComponent: () => import('./Issue/issue-details/issue-details.component').then((m) => m.IssueDetailsComponent)
      }


];
