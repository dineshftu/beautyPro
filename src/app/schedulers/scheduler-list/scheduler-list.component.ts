import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AppointmentsService } from 'src/app/appointments/appointments.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})
export class SchedulerListComponent implements OnInit {
  module: string;
  schedulesList = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ]
  constructor(
    private data: DataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // this.loadSchedulers();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Schedulers");

  }

  loadSchedulers() {
    throw new Error("Method not implemented.");
  }

}
