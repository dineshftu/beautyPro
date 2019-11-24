import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SchedulersRoutingModule } from './schedulers-routing.module';
import { SchedulerItemComponent } from './scheduler-item/scheduler-item.component';
import { SchedulerListComponent } from './scheduler-list/scheduler-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatFormFieldModule, MatDatepickerModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [SchedulerItemComponent, SchedulerListComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    SchedulersRoutingModule,
    FormsModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule
  ]
})
export class SchedulersModule { }
