import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppointmentService } from '../services/appointment.service';
import { Router } from '@angular/router';
import { NewAppointmentRequest, Employees, EmployeeFilterRequest, AppointmentTreatment } from '../models/appointment.model';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { TreatmentService } from 'src/app/treatments/treatment.service';
import { ClientsService } from 'src/app/clients/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Department, Treatment, TreatmentFilterRequest } from 'src/app/treatments/treatments.model';
import * as moment from 'moment';

@Component({
  selector: 'app-new-appointments',
  templateUrl: './new-appointments.component.html',
  styleUrls: ['./new-appointments.component.scss']
})
export class NewAppointmentComponent implements OnInit {

  private ngUnSubscription = new Subject();
  public customers: Customer[];
  public departments: Department[];
  public treatmentList: Treatment[];
  public employeesList: Employees[];
  public keyword = 'fullName';
  public keywordTreatment = 'ttname';
  public keywordEmployee = 'name';
  public isDepartmentNotSelected: boolean = false;
  private ttid: number;
  private empNo: number;
  private treatmentDuration: number;
  private startTimespan: string;
  private endTimespan: string;

  title = 'demo';
  private exportTime = { hour: 0, minute: 0, meriden: 'AM', format: 24 };
  private exportEndTime = { hour: 0, minute: 0, meriden: 'AM', format: 24 };

  constructor(
    public dialogRef: MatDialogRef<NewAppointmentComponent>,
    private appointmentService: AppointmentService,
    private route: Router,
    private treatmentService: TreatmentService,
    public clientsService: ClientsService
  ) { }

  public newAppointmentRequest = new NewAppointmentRequest();

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getCustomerList();
    this.getDepartments();
  }

  getCustomerList() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest())
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      });
  }

  createCustomerRequest() {
    return <CustomerSearchRequest>{
      searchText: ''
    };
  }

  selectCustomerEvent(e: any) {
    this.newAppointmentRequest.customerId = e.customerId;
  }

  getDepartments() {
    this.treatmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });
  }

  onDepartmentChange(e: any) {
    this.isDepartmentNotSelected = false;
    this.newAppointmentRequest.departmentId = e.target.value;

    this.getTreatments();
    this.getEmployees();
  }

  getTreatments() {
    this.treatmentService
      .getFilteredTreatmentList(this.generateTreatmentFilterRequest())
      .subscribe((treatments: Treatment[]) => {
        this.treatmentList = treatments;
      });
  }

  private generateTreatmentFilterRequest() {
    return <TreatmentFilterRequest>{
      departmentId: this.newAppointmentRequest.departmentId
    }
  }

  selectTreatmentEvent(e: any) {
    this.ttid = e.ttid;
    this.treatmentDuration = e.duration;
  }

  getEmployees() {
    this.appointmentService
      .getFilteredEmployees(this.generateEmployeeFilterRequest())
      .subscribe((employees: Employees[]) => {
        this.employeesList = employees;
      });
  }

  private generateEmployeeFilterRequest() {
    return <EmployeeFilterRequest>{
      departmentId: this.newAppointmentRequest.departmentId
    }
  }

  selectEmployeeEvent(e: any) {
    this.empNo = e.empno;
  }

  onDateChange(e: any) {
    this.newAppointmentRequest.bookedDate = new Date(e.target.value);
  }

  onChangeHour(e: any) {
    let totalMinutes = ((parseInt(e.hour) * 60) + parseInt(e.minute)) + this.treatmentDuration;
    let hours = Math.floor(totalMinutes / 60);
    let seconds = 0;
    let minutes = (totalMinutes % 60);
    this.exportEndTime = { hour: hours, minute: minutes, meriden: 'AM', format: 24 };

    this.startTimespan = this.getTimeSpan(e.hour, e.minute, seconds);
    this.endTimespan = this.getTimeSpan(hours, hours, seconds);
    //  parseInt(e.hour).toString().padStart(2, '0') + ':' +
    //   parseInt(e.minute).toString().padStart(2, '0') + ':' +
    //   seconds.toString().padStart(2, '0');

    // this.endTimespan = hours.toString().padStart(2, '0') + ':' +
    //   hours.toString().padStart(2, '0') + ':' +
    //   seconds.toString().padStart(2, '0');


  }

  getTimeSpan(hours: number, minutes: number, seconds: number) {
    return hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
  }

  save() {

    if (!this.newAppointmentRequest.departmentId) {
      this.isDepartmentNotSelected = true;
      return;
    }


    this.newAppointmentRequest.treatments.push(<AppointmentTreatment>{
      ttid: this.ttid,
      empNo: this.empNo,
      startTime: this.startTimespan,
      endTime: this.endTimespan
    });

    this.appointmentService
      .addNewAppointment(this.generateAppointmentRequest())
      .subscribe((result: any) => {
        console.log(result);
      }, (error: any) => {

      }, () => {
        this.route.navigate(['home/appointments']);
        this.dialogRef.close();
      });
  }
  cancel() {
    this.dialogRef.close();
  }

  private generateAppointmentRequest(): NewAppointmentRequest {
    return <NewAppointmentRequest>{
      customerId: this.newAppointmentRequest.customerId,
      bookedDate: this.newAppointmentRequest.bookedDate,
      departmentId: this.newAppointmentRequest.departmentId,
      treatments: this.newAppointmentRequest.treatments
    };
  }

}
