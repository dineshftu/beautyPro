import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{ path: 'treatments', loadChildren: () => import('./treatments/treatments.module').then(m => m.TreatmentsModule) }, { path: 'clients', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
