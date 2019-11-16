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

  title = 'demo';
  private exportTime = { hour: 0, minute: 0, meriden: 'AM', format: 12 };


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
    this.empNo = e.empNo;
  }

  onDateChange(e: any) {
    this.newAppointmentRequest.bookedDate = new Date(e.target.value);
  }

  onChangeHour(event: any) {
    console.log('event', event);
  }

  save() {

    if (!this.newAppointmentRequest.departmentId) {
      this.isDepartmentNotSelected = true;
      return;
    }


    // this.newAppointmentRequest.treatments.push(<AppointmentTreatment>{
    //   ttid: this.ttid,
    //   empNo: this.empNo
    // });

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

  private generateAppointmentRequest(): NewAppointmentRequest {
    return <NewAppointmentRequest>{
    };
  }

}
