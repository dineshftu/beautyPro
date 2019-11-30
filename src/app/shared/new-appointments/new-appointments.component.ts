import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppointmentService } from '../services/appointment.service';
import { Router } from '@angular/router';
import { NewAppointmentRequest, Employees, EmployeeFilterRequest, AppointmentTreatment } from '../models/appointment.model';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { TreatmentService } from 'src/app/treatments/treatment.service';
import { ClientsService } from 'src/app/clients/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Treatment, TreatmentFilterRequest } from 'src/app/treatments/treatments.model';
import * as moment from 'moment';
import { Department } from '../models/department.model';
import { DepartmentService } from '../services/department.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-appointments',
  templateUrl: './new-appointments.component.html',
  styleUrls: ['./new-appointments.component.scss']
})
export class NewAppointmentComponent implements OnInit {
  @ViewChild('auto', { static: false }) auto;
  @ViewChild('autoTreatment', { static: false }) autoTreatment;

  private ngUnSubscription = new Subject();

  public customers: Customer[];
  public departments: Department[];
  public treatmentList: Treatment[];
  public employeesList: Employees[];

  public keyword = 'fullName';
  public keywordTreatment = 'ttname';
  public keywordEmployee = 'name';

  public isDepartmentNotSelected: boolean = false;
  public isTreatmentNotSelected: boolean = false;
  public isCustomerNotSelected: boolean = false;
  public isEmployeeNotSelected: boolean = false;
  public isDateNotSelected: boolean = false;
  public isStartTimeNotSelected: boolean = false;
  public isStartTimeInvalid: boolean = false;
  public isEndTimeInvalid: boolean = false;
  public isTimeInvalid: boolean = false;

  private ttid: number;
  private empNo: number;
  private treatmentDuration: number;
  public treatmentQty: number = 0;
  private startTimespan: string;
  private endTimespan: string;

  minDate = new Date(moment().format('YYYY, MM, DD'));
  initdate = moment(this.data.selectedDate);

  public exportTime = { hour: 0, minute: 0, meriden: 'AM', format: 12 };
  public exportEndTime = { hour: 0, minute: 0, meriden: 'AM', format: 12 };

  public startHour: string;
  public startMin: string;
  public endHour: number;
  public endMin: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewAppointmentComponent>,
    private appointmentService: AppointmentService,
    private route: Router,
    private treatmentService: TreatmentService,
    private departmentService: DepartmentService,
    public clientsService: ClientsService,
    private toastr: ToastrService
  ) { }

  public newAppointmentRequest = new NewAppointmentRequest();

  ngOnInit() {
    console.log(this.data)
  }

  ngAfterViewInit() {

    console.log('date', this.initdate);
    this.setStartTime();
    this.getCustomerList();
    this.getDepartments();
  }

  setStartTime() {
    let totalMinutesByIndex = this.data.selectedIndex * 5;
    let hoursByIndex = Math.trunc(totalMinutesByIndex / 60);
    let minutesByIndex = (totalMinutesByIndex - (hoursByIndex * 60));
    let meriden = 'AM';
    let seconds = 0;

    hoursByIndex += 8;

    if (hoursByIndex >= 12) {
      if (hoursByIndex != 12) {
        hoursByIndex -= 12;
      }

      meriden = 'PM';
    }

    this.startTimespan = this.getTimeSpan(hoursByIndex, minutesByIndex, seconds);
    this.exportTime = { hour: hoursByIndex, minute: minutesByIndex, meriden: meriden, format: 12 };
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
    this.isCustomerNotSelected = false;
    this.newAppointmentRequest.customerId = e.customerId;
  }

  getDepartments() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });
  }

  onDepartmentChange(e: any) {
    this.isDepartmentNotSelected = false;
    this.newAppointmentRequest.departmentId = e.target.value;

    this.ttid = null;
    this.auto.clear();
    this.autoTreatment.clear();

    this.exportEndTime = { hour: 0, minute: 0, meriden: 'AM', format: 24 };

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
    this.isTreatmentNotSelected = false;
    this.ttid = e.ttid;
    this.treatmentDuration = e.duration;

    if (this.startTimespan) {
      this.setEndTime(this.startTimespan.split(":")[0], this.startTimespan.split(":")[1]);
    }
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
    this.isEmployeeNotSelected = false;
    this.empNo = e.empno;
  }

  onDateChange(e: any) {
    this.isDateNotSelected = false;
    this.newAppointmentRequest.bookedDate = new Date(e.target.value);
  }

  onChangeHour(e: any) {
    let startHour = (parseInt(e.hour));

    if (e.meriden == 'PM') {
      startHour += 12;
    }

    this.isStartTimeNotSelected = false;
    this.setEndTime(startHour.toString(), e.minute);

    this.isStartTimeInvalid = (parseInt(e.hour) < 8);

    this.validateSave();
  }

  setEndTime(hour: string, minute: string) {

    this.startHour = hour;
    this.startMin = minute;

    let tDuration = this.treatmentDuration;

    if (this.treatmentQty != 0) {
      tDuration *= this.treatmentQty;
    }

    let totalMinutes = ((parseInt(hour) * 60) + parseInt(minute)) + tDuration;
    let meriden = 'AM';
    let hours = Math.floor(totalMinutes / 60);
    let seconds = 0;
    let minutes = ((totalMinutes - (hours * 60)) % 60);

    this.endHour = hours;
    this.endMin = minutes;
    this.startTimespan = this.getTimeSpan(parseInt(hour), parseInt(minute), seconds);
    this.endTimespan = this.getTimeSpan(hours, minutes, seconds);

    if (hours >= 12) {
      if (hours != 12) {
        hours -= 12;
      }

      meriden = 'PM';
    }

    this.isEndTimeInvalid = ((isNaN(hours)) || ((hours >= 12) && (minutes > 0)));

    this.exportEndTime = { hour: hours, minute: minutes, meriden: meriden, format: 12 };

    this.getTimeValidity();
  }

  getTimeSpan(hours: number, minutes: number, seconds: number) {
    return hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
  }

  save() {

    this.validateSave();

    this.newAppointmentRequest.treatments.push(<AppointmentTreatment>{
      ttid: this.ttid,
      empNo: this.empNo,
      startTime: this.startTimespan,
      endTime: this.endTimespan,
      qty: this.treatmentQty
    });

    this.appointmentService
      .addNewAppointment(this.generateAppointmentRequest())
      .subscribe((result: any) => {
        console.log(result);
      }, (error: any) => {

      }, () => {
        this.route.navigate(['home/scheduler']);
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

  validateSave() {
    if (!this.newAppointmentRequest.customerId) {
      this.isCustomerNotSelected = true;
      return;
    }

    if (!this.newAppointmentRequest.departmentId) {
      this.isDepartmentNotSelected = true;
      return;
    }

    if (!this.ttid) {
      this.isTreatmentNotSelected = true;
      return;
    }

    if (!this.empNo) {
      this.isEmployeeNotSelected = true;
      return;
    }

    if (!this.newAppointmentRequest.bookedDate) {
      this.isDateNotSelected = true;
      return;
    }

    if (!this.startTimespan) {
      this.isStartTimeNotSelected = true;
      return;
    }

    if (this.isStartTimeInvalid) {
      return;
    }

    if (this.isEndTimeInvalid) {
      return;
    }

    if (this.isTimeInvalid) {
      return;
    }

  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  onQtyChange(event: any) {
    this.treatmentQty = Number(event.target.value);

    if (this.startTimespan) {
      this.setEndTime(this.startTimespan.split(":")[0], this.startTimespan.split(":")[1]);
    }

  }

  getTimeValidity() {

    let treamentStartTimeMin = ((parseInt(this.startHour) * 60) + (parseInt(this.startMin)));
    let treamentEndTimeMin = ((this.endHour * 60) + this.endMin);
    let isNotValidTIme = false;

    if (this.data.scheduleResponse.schedules != null || this.data.scheduleResponse.schedule != undefined) {

      this.data.scheduleResponse.schedules.forEach(function (sched: any) {
        let schedStartTimeMin = (parseInt(sched.startTime.split(":")[0]) * 60) + (parseInt(sched.startTime.split(":")[1]));
        let schedEndTimeMinu = (parseInt(sched.endTime.split(":")[0]) * 60) + (parseInt(sched.startTime.split(":")[1]));

        isNotValidTIme = !(((treamentStartTimeMin < schedStartTimeMin) && (treamentEndTimeMin < schedStartTimeMin))
          || ((treamentStartTimeMin > schedEndTimeMinu) && (treamentEndTimeMin > schedEndTimeMinu)));

        //if (isNotValidTIme) return;
      });
    } else {
      isNotValidTIme = false;
    }

    this.isTimeInvalid = isNotValidTIme;
  }


}
