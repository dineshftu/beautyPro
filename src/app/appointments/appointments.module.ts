import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentsService } from './appointments.service';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { NewAppointmentComponent } from '../shared/new-appointments/new-appointments.component';

@NgModule({
  declarations: [
    AppointmentListComponent,
    ViewAppointmentComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    AppointmentsRoutingModule,
    SharedModule
  ],
  providers: [
    AppointmentsService
  ],
  entryComponents: [
    NewAppointmentComponent
  ]
})
export class AppointmentsModule { }
