import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth-routing.module').then(m => m.AuthRoutingModule),
  },
  {
    path: '',
    loadChildren: () => import('./components/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule),
    canActivate: [AuthGuardService]
  },
  // {
  //   path: '',
  //   component: LoginComponent,
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
