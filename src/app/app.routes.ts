import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login.component')
                .then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () =>
            import('./components/common/default-layout/default-layout.component')
                .then(m => m.DefaultLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full'
            },
            {
                path: 'overview',
                loadComponent: () =>
                    import('./components/overview-dashboard/overview-dashboard.component')
                        .then(m => m.OverviewDashboardComponent),
                data: {
                    label: 'Overview',
                    icon: 'home'
                }
            },
            {
                path: 'crowd-entries',
                loadComponent: () =>
                    import('./components/crowd-entries/crowd-entries.component')
                        .then(m => m.CrowdEntriesComponent),
                data: {
                    label: 'Crowd Entries',
                    icon: 'open_in_full'
                }
            }
        ]
    }

];
