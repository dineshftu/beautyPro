import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentsService } from './appointments.service';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppointmentListComponent,
    ViewAppointmentComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    AppointmentsRoutingModule
  ],
  providers: [
    AppointmentsService
  ]
})
export class AppointmentsModule { }
