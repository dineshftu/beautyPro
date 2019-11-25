import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Appointments, AppointmentFilterRequest } from '../appointments.model';
import { AppointmentsService } from '../appointments.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { NewAppointmentComponent } from 'src/app/core/new-appointment/new-appointment.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NewAppointmentComponent } from 'src/app/shared/new-appointments/new-appointments.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, OnDestroy {

  private ngUnSubscription = new Subject();
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
    public dialog: MatDialog
  ) {
    this.routeReload();
  }

  ngOnInit() {
    this.loadAppointments();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Appointments");
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.loadAppointments();
        }
      })
  }

  loadAppointments() {
    this.appoinmentService
      .getAppointmentList(this.createCustomerRequest(1))
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((appointments: Appointments[]) => {
        this.appointmentList = appointments;
      });
  }

  createCustomerRequest(departmentId: number) {
    return <AppointmentFilterRequest>{
      departmentId: departmentId
    };
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

  ngOnDestroy() {
    this.ngUnSubscription.next(true);
    this.ngUnSubscription.complete();
  }
}
