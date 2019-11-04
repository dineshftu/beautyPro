import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchedulersComponent } from './schedulers.component';

const routes: Routes = [{ path: '', component: SchedulersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulersRoutingModule { }
