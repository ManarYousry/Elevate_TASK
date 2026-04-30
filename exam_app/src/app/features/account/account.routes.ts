import { Routes } from '@angular/router';

export const account_routes: Routes = [

    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    },


    {
        path: 'account',
        loadComponent: () =>
            import('../account/account-layout/account-layout')
                .then(m => m.AccountLayout),
        children: [

            {
                path: 'profile',
                loadComponent: () =>
                    import('../account/components/profile/profile')
                        .then(m => m.Profile),

            },
                {
                path: 'change-password',
                loadComponent: () =>
                    import('../account/components/change-password/change-password')
                        .then(m => m.ChangePassword),
            }



        ]
    }


];
