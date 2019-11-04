import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulersRoutingModule } from './schedulers-routing.module';
import { SchedulersComponent } from './schedulers.component';


@NgModule({
  declarations: [SchedulersComponent],
  imports: [
    CommonModule,
    SchedulersRoutingModule
  ]
})
export class SchedulersModule { }
