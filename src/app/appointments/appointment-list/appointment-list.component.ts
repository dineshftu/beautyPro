import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Appointments, AppointmentFilterRequest, AppointmentStatusRequest } from '../appointments.model';
import { AppointmentsService } from '../appointments.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { NewAppointmentComponent } from 'src/app/core/new-appointment/new-appointment.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NewAppointmentComponent } from 'src/app/shared/new-appointments/new-appointments.component';
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ToastrService } from 'ngx-toastr';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnSubscription = new Subject();
  module: string;
  appointmentList: Appointments[];
  departments: Department[];
  selectedDepartment = 0;
  appointmentStatus = ["pending", "confirmed", "cancelled"];

  constructor(
    private data: DataService,
    private appoinmentService: AppointmentsService,
    private route: Router,
    private departmentService: DepartmentService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.routeReload();
  }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Appointments");
    this.loadAppointments();
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
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

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    this.loadAppointments();
  }

  onStatusChange(e: any, appointment: Appointments) {
    let appointmentStatusRequest = new AppointmentStatusRequest();
    appointmentStatusRequest.status = e.target.value;
    appointmentStatusRequest.csId = appointment.csId;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to change the status?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.appoinmentService.changeStatusOfAppointment(appointmentStatusRequest)
            .subscribe(
              (response) => {
                this.toastr.success('Status Updated!');
                this.route.navigate(['/home/appointments']);
              },
              (error) => {
                this.toastr.error("Status Not Updated!");
                console.log(error);
              }
            );
        }
      }, (error) => {
        console.log(error);
      }
    );
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

  addEditAppointment(appointment: Appointments) {
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
