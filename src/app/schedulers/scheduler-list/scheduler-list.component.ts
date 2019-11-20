import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AppointmentsService } from 'src/app/appointments/appointments.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SchedulerService } from '../scheduler.service';
import { SchedulerFilterRequest, ScheduleResponse } from '../scheduler.model';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})
export class SchedulerListComponent implements OnInit {

  public selectedDepartment = 0;
  public scheduleResponseList: ScheduleResponse[];

  module: string;

  constructor(
    private data: DataService,
    public dialog: MatDialog,
    private schedulerService: SchedulerService
  ) { }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Schedulers");
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
      departmentId: this.selectedDepartment
    }
  }

  loadSchedulers() {
    throw new Error("Method not implemented.");
  }

  generateTimeIndexes() {
    this.scheduleResponseList.forEach(function (emp) {
      var timeIndexes = Array.apply(null, Array(48)).map(function () { return 'default' })

      emp.schedules.forEach(function (sched) {

        let startingIndex = ((((parseInt(sched.startTime.split(":")[0]) * 60) + parseInt(sched.startTime.split(":")[1])) - 480) / 10);
        let endIndex = ((((parseInt(sched.endTime.split(":")[0]) * 60) + parseInt(sched.endTime.split(":")[1])) - 480) / 10);

        timeIndexes.fill('start', startingIndex, ++startingIndex);
        timeIndexes.fill('hasAppoinment', startingIndex, endIndex);

        sched.timeIndexes = timeIndexes;
      });

    });
    console.log('this.scheduleResponseList', this.scheduleResponseList);
  }



}
