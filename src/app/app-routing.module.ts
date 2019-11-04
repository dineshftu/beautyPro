import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { AuthGuard } from './authGuard/auth.guard';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { LoginComponent } from './core/login/login.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'treatments',
        pathMatch: 'full'
      },
      {
        path: 'treatments',
        loadChildren: () => import('./treatments/treatments.module').then(m => m.TreatmentsModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'appointments',
        loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule)
      },
      {
        path: 'vouchers',
        loadChildren: () => import('./vouchers/vouchers.module').then(m => m.VouchersModule)
      },
      {
        path: 'scheduler',
        loadChildren: () => import('./schedulers/schedulers.module').then(m => m.SchedulersModule)
      },

    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
