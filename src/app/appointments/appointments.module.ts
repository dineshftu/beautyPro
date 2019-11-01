import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentsService } from './appointments.service';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';
import { CheckoutComponent } from './checkout/checkout.component';


@NgModule({
  declarations: [
    AppointmentListComponent,
    ViewAppointmentComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule
  ],
  providers: [
    AppointmentsService
  ]
})
export class AppointmentsModule { }
