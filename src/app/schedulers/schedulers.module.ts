import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulersRoutingModule } from './schedulers-routing.module';
import { SchedulerItemComponent } from './scheduler-item/scheduler-item.component';
import { SchedulerListComponent } from './scheduler-list/scheduler-list.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [SchedulerItemComponent, SchedulerListComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    SchedulersRoutingModule,
  ]
})
export class SchedulersModule { }
