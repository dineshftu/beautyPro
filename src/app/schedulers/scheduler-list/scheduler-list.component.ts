import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AppointmentsService } from 'src/app/appointments/appointments.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SchedulerService } from '../scheduler.service';
import { SchedulerFilterRequest, ScheduleResponse } from '../scheduler.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/models/department.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})

export class SchedulerListComponent implements OnInit {
  // public date = formatDate(new Date(), 'yyyy-mm-dd', '', '');
  public selectedDate;
  minTime = 5;
  public selectedDepartment = 0;
  public scheduleResponseList: ScheduleResponse[];
  departments: Department[];
  timeInterval = [
    '8am', '9am', '10am', '11am', '12am', '13pm', '14pm', '15pm', '16pm'
  ];
  private ngUnSubscription = new Subject();


  module: string;

  constructor(
    private departmentService: DepartmentService,
    private data: DataService,
    public dialog: MatDialog,
    private schedulerService: SchedulerService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.selectedDate = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Schedulers");
    this.loadSchedules();
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    this.loadSchedules();
  }

  onDateChange(e: any) {
    this.selectedDate = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');
    this.loadSchedules();
  }

  loadSchedules() {
    this.schedulerService
      .getFilteredScheduleList(this.generateScheduleFilterRequest())
      .subscribe((schedules: ScheduleResponse[]) => {
        this.scheduleResponseList = schedules;
        console.log('this.scheduleResponseList', this.scheduleResponseList);
        this.generateTimeIndexes();
      });
  }

  private generateScheduleFilterRequest() {
    return <SchedulerFilterRequest>{
      departmentId: this.selectedDepartment,
      workingDate: this.selectedDate
    }
  }

  loadSchedulers() {
    throw new Error("Method not implemented.");
  }

  generateTimeIndexes() {
    let timeIndexLength = (this.timeInterval.length - 1) * (60 / this.minTime),
      workingMin = (this.timeInterval.length - 1) * 60,
      minWorkTime = this.minTime;

    this.scheduleResponseList.forEach(function (emp) {
      var timeIndexes = Array.apply(null, Array(timeIndexLength)).map(function () { return 'default' })

      emp.schedules.forEach(function (sched) {
        let startingIndex = ((((parseInt(sched.startTime.split(":")[0]) * 60) + parseInt(sched.startTime.split(":")[1])) - workingMin) / minWorkTime);
        let endIndex = ((((parseInt(sched.endTime.split(":")[0]) * 60) + parseInt(sched.endTime.split(":")[1])) - workingMin) / minWorkTime);
        sched.startIndex = startingIndex;
        timeIndexes.fill('start', startingIndex, ++startingIndex);
        timeIndexes.fill('hasAppoinment', startingIndex, endIndex);
      });

      emp.timeIndexes = timeIndexes;
    });
    console.log('this.scheduleResponseList', this.scheduleResponseList);
  }
}
