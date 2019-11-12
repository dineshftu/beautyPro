import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    LoginComponent,
    PageNotFoundComponent,
    NewAppointmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [
    LayoutComponent,
    LoginComponent,
    PageNotFoundComponent
  ],
  entryComponents: [
    NewAppointmentComponent
  ]

})
export class CoreModule { }
