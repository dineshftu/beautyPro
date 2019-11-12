import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Appointments } from '../appointments.model';
import { AppointmentsService } from '../appointments.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewAppointmentComponent } from 'src/app/core/new-appointment/new-appointment.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  module: string;
  appointmentList: Appointments[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];

  appointmentStatus = [
    "New", "Confirmed"
  ];

  constructor(
    private data: DataService,
    private appoinmentService: AppointmentsService,
    private route: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.loadAppointments();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Appointments");
  }

  loadAppointments() {
    this.appoinmentService.getAppointmenttList().subscribe((appointments: Appointments[]) => {
      this.appointmentList = appointments;
    });
  }

  addNewAppointment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = '';
    this.dialog.open(NewAppointmentComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        //console.log(response);
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['']);
          }
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

}
