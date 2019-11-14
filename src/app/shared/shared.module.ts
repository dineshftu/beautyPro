import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAppointmentComponent } from './new-appointments/new-appointments.component';



@NgModule({
  declarations: [NewAppointmentComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NewAppointmentComponent
  ]
})
export class SharedModule { }
