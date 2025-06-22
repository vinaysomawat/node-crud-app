import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'addUser', loadComponent: () => import('./add-user/add-user').then(m => m.AddUserComponent)},
];
